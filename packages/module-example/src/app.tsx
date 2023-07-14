import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { ExampleModuleProps } from '.'

export default class ExampleModuleRenderer extends ModuleRenderer {
  readonly style = `
    .example-module {
      background-color: green;
    }
  `

  render({ message }: ExampleModuleProps): JSX.Element {
    return (
      <>
        <style>{this.style}</style>
        <div className="example-module">
          <h1>Hi ! This is the example module</h1>
          <p>{message}</p>
        </div>
      </>
    )
  }
}
