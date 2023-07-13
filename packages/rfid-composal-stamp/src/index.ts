import { Module, ModuleProps } from '@yalk/module'

export interface ComposalStampRFIDProps extends ModuleProps {
  status: 'idle' | 'loading' | 'start' | 'end' | 'error'
  additionalMessage?: string
  data: {
    display_name: string
    avatar_url: string
    theoretical_clocking_time: string
    clocked_in_at: string
  }
}

export default class ComposalStampRFID extends Module {
  private interval: NodeJS.Timeout | null = null

  init(): void {}

  destroy(): void {}

  start(): void {}

  stop(): void {}

  onReceive(type: string, data: any): void {
    // Trigger the clocking using the keyboard event (RFID reader)
    if (type === 'keyboard') {
      this.notify({
        status: 'loading',
        data: data,
      })

      this.toggleClocking(data)
    }

    // Trigger the clocking using the HTTP event (API)
    // {
    //   "event": "toggle",
    //   "nfc_serial_number": "1234567890"
    // }
    if (type === 'http') {
      if (data.event === 'toggle') {
        this.notify({
          status: 'loading',
          data: data.nfc_serial_number,
        })

        this.toggleClocking(data.nfc_serial_number)
      }
    }
  }

  onNewSubscriber(): void {
    this.notify({
      status: 'idle',
      data: null,
    })
  }

  private toggleClocking = async (rfid: string): Promise<void> => {
    const url = this.getEntryValue<string>('composalUrl')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer NUYC7IzclxqvGI3NyTKrzApO379nmeAyDE-2BYci_H6-MYugWyzqRFm362LHiTb1`,
      },
      body: JSON.stringify({ nfc_serial_number: rfid }),
    })

    if (response.ok) {
      const data = await response.json()

      let message = ''
      const theoreticalClockingTime = new Date(data.user.theoretical_clocking_time)
      const clockedInAt = new Date(data.user.clocked_in_at)

      if (data.event_type === 'start') {
        // Check if the user has clocked in on time
        if (theoreticalClockingTime.getTime() < clockedInAt.getTime()) {
          const lateTime = Math.floor(clockedInAt.getTime() - theoreticalClockingTime.getTime()) / 1000 / 60
          if (lateTime > 60) {
            message = `You are late by ${Math.floor(lateTime / 60)} hours`
          } else {
            message = `You are late by ${Math.floor(lateTime)} minutes`
          }
        } else if (theoreticalClockingTime.getTime() > clockedInAt.getTime()) {
          const earlyTime = Math.floor(theoreticalClockingTime.getTime() - clockedInAt.getTime()) / 1000 / 60
          if (earlyTime > 60) {
            message = `You are early by ${Math.floor(earlyTime / 60)} hours`
          } else {
            message = `You are early by ${Math.floor(earlyTime)} minutes`
          }
        } else {
          message = 'You are on time !'
        }
      }

      this.notify({
        status: data.event_type,
        additionalMessage: message,
        data: {
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url,
          theoretical_clocking_time: data.user.theoretical_clocking_time,
          clocked_in_at: clockedInAt.toLocaleTimeString('fr-FR', { hour12: false, timeStyle: 'short' }),
        },
      })
      this.resetAfter(7000)
    } else {
      const data = await response.json()
      this.notify({
        status: 'error',
        additionalMessage: data.message,
        data: null,
      })
      this.resetAfter(7000)
    }
  }

  private resetAfter = (time: number): void => {
    // Prevent multiple reset so time stays right
    if (this.interval) {
      clearTimeout(this.interval)
      this.interval = null
    }

    this.interval = setTimeout(() => {
      this.notify({
        status: 'idle',
        data: null,
      })
    }, time)
  }
}
