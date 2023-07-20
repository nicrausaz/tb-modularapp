import { Module, ModuleProps } from '@yalk/module'

/**
 * Here you will define the render props type of your modules.
 * That defines the data that will be passed to the render function of your module.
 * You will then need to send this data to your render using the <this.notify(data): render> method.
 */
export interface ExampleModuleProps extends ModuleProps {
  message: string
}

export default class ExampleModule extends Module {
  init(): void {
    // This is where you will initialize anything you will need for your module.
    // This method is called once the module is loaded into the application.
    // It is also called every time the application is reloaded
    // You can remove this method if you don't need it
    //
    // Your code here ...
  }

  destroy(): void {
    // This is where you will release anything you initialized in the init() method.
    // This method is called once the module is unloaded from the application.
    // You can remove this method if you don't need it
    //
    // Your code here ...
  }

  start(): void {
    // This is where you will define the behavior of your module.
    // This method is called once the module is started.
    // This method is mandatory.
    //
    // Tips:
    // - You can read from the configuration using the getEntryValue method:
    // this.getEntryValue<string>('anExampleText')
    //
    // - You can send data to be rendered using the notify method:
    // this.notify({ message: 'Hello World!' })
    //
    // - You can send data trought a "required" accessors using the sendData method:
    // this.sendData('', { message: 'Hello World!' } )
    //
    // TODO: more tips
    //
    // Your code here ...
    //
  }

  stop(): void {
    // This is where you will define the behavior of your module when it is stopped.
    // This method is called once the module is stopped.
    // You can remove this method if you don't need it
    // Your code here ...
  }

  protected onReceive(type: string, data: unknown): void {
    // This is where you will define the behavior of your module when it receives data.
    // This method is called every time the module receives data.

    // type: The type of received data (usually the key of the device accessor)
    // data: The received data

    // Notice: to receive data, you need to register a device accessor in the configuration
    // using the "requires" key.

    // Your code here ...
    if (type === 'http') {
      console.log('Received data from http', data)
    }
  }

  onNewSubscriber(): void {
    // This is where you will define the behavior of your module when a new subscriber is registered.
    // This method is called every time a new subscriber is registered.
    this.notify({ message: 'Hello World!' })
  }
}
