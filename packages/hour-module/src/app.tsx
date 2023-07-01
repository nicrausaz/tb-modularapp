import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { HourModuleProps } from '.'

export default class HourModuleRenderer extends ModuleRenderer {
  render({ date }: HourModuleProps): JSX.Element {
    const d = new Date(date)

    return (
      <div className="w-full h-full text-center">
        <div className="clock rounded-full bg-white border-4 border-white shadow-inset-2px-3px-8px">
          <div className="wrap overflow-hidden relative w-350 h-350 rounded-full">
            <span
              className="hour absolute h-100 w-6 mx-auto top--27 left-0 bottom-0 right-0 bg-black origin-bottom-center transform"
              style={{
                transform: `rotate(${d.getHours() * 30}deg)`,
              }}
            ></span>
            <span
              className="minute absolute h-130 w-4 top--38 left-0 bg-black origin-bottom-center transform rotate-90"
              style={{
                transform: `rotate(${d.getMinutes() * 6}deg)`,
              }}
            ></span>
            <span
              className="second absolute h-90 w-2 mx-auto top--26 left-0 bottom-0 right-0 bg-red-500 origin-bottom-center transform rotate-180"
              style={{
                transform: `rotate(${d.getSeconds() * 6}deg)`,
              }}
            ></span>
            <span className="dot absolute top-0 left-0 right-0 bottom-0 w-12 h-12 rounded-full bg-white border-2 border-black mx-auto"></span>
          </div>
        </div>
        <span className="text-xl">{d.toString()}</span>
      </div>
    )
  }
}
