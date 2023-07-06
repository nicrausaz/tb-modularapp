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

  onReceive(type: string, data: string): void {
    if (type !== 'keyboard') {
      return
    }

    this.notify({
      status: 'loading',
      data: data,
    })

    this.toggleClocking(data)
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

      // Check if the user has clocked in on time
      if (data.event_type === 'start') {
        const theoreticalClockingTime = new Date(data.theoretical_clocking_time)
        const clockedInAt = new Date(data.clocked_in_at)

        if (theoreticalClockingTime.getTime() < clockedInAt.getTime()) {
          message = `You are late by ${
            Math.floor(clockedInAt.getTime() - theoreticalClockingTime.getTime()) / 1000 / 60
          }`
        } else if (theoreticalClockingTime.getTime() > clockedInAt.getTime()) {
          message = `You are early ${Math.floor(theoreticalClockingTime.getTime() - clockedInAt.getTime()) / 1000 / 60}`
        } else {
          message = 'You are on time'
        }
      }

      this.notify({
        status: data.event_type,
        data: {
          display_name: data.user.display_name,
          avatar_url: data.user.avatar_url,
          theoretical_clocking_time: data.theoretical_clocking_time,
          clocked_in_at: data.clocked_in_at,
          additionalMessage: message,
        },
      })
      this.resetAfter(5000)
    } else {
      const data = await response.json()
      this.notify({
        status: 'error',
        additionalMessage: data.message,
        data: null,
      })
      this.resetAfter(5000)
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
