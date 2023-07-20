import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { ExampleModuleProps } from '.'

export default class ExampleModuleRenderer extends ModuleRenderer {
  protected style: string = `
    .example-module {
      background-color: lightgreen;
      padding: 6px;
    }
  `

  display({ message }: ExampleModuleProps): JSX.Element {
    return (
      <div className="example-module">
        <h1>Hi ! This is the example module</h1>
        <p>{message}</p>
      </div>
    )
  }
}
