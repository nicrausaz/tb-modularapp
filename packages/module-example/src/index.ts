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
    // todo
  }

  onReceive(type: string, data: ExampleModuleProps): void {}

  onNewSubscriber(): void {
    // Nothing to do here
  }
}
