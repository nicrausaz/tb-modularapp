import { Module, ModuleProps } from '@yalk/module'
import { SerialPort } from 'serialport'

export interface HourModuleProps extends ModuleProps {
  date: string
}

export default class RFIDModule extends Module {
  init(): void {
    // Nothing to do here
  }

  destroy(): void {
    // Nothing to do here
  }

  start(): void {
    const port = new SerialPort(
      {
        path: '/dev/tty-usbserial1',
        baudRate: 57600,
      },
      (err) => {
        if (err) {
          console.error(err)
        }
      },
    )

    port.open((err) => {
      if (err) {
        console.error(err)
      }
    })

    port.on('data', (data) => {
      console.log(data.toString('utf8'))
    })
  }

  stop(): void {
    //
  }

  onReceive(data: ModuleProps): void {
    // Nothing to do here
  }
}
