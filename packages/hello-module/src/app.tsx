import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { HelloModuleProps } from '.'

export default class HelloModuleRenderer extends ModuleRenderer {
  render({ name }: HelloModuleProps): JSX.Element {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 italic">Hello</h5>
        <p className="font-normal text-gray-700 text-2xl">{name}</p>
      </div>
    )
  }
}
