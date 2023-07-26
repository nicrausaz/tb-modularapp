import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { HourModuleProps } from '.'

export default class HourModuleRenderer extends ModuleRenderer {
  protected style: string = `
  .clock {
    border-radius: 100%;
    background: #ffffff;
    font-family: "Montserrat";
    border: 5px solid white;
    box-shadow: inset 2px 3px 8px 0 rgba(0, 0, 0, 0.1);
    margin: auto;
  }

  .wrap {
    overflow: hidden;
    position: relative;
    width: 350px;
    height: 350px;
    border-radius: 100%;
  }

  .minute,
  .hour {
    position: absolute;
    height: 100px;
    width: 6px;
    margin: auto;
    top: -27%;
    left: 0;
    bottom: 0;
    right: 0;
    background: black;
    transform-origin: bottom center;
    transform: rotate(0deg);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
    z-index: 1;
  }

  .minute {
    position: absolute;
    height: 130px;
    width: 4px;
    top: -38%;
    left: 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
    transform: rotate(90deg);
  }

  .second {
    position: absolute;
    height: 90px;
    width: 2px;
    margin: auto;
    top: -26%;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 4px;
    background: #FF4B3E;
    transform-origin: bottom center;
    transform: rotate(180deg);
    z-index: 1;
  }

  .dot {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 12px;
    height: 12px;
    border-radius: 100px;
    background: white;
    border: 2px solid #1b1b1b;
    border-radius: 100px;
    margin: auto;
    z-index: 1;
  }

  .details: {
    text-align: center;
  }
  `

  display({ date }: HourModuleProps): JSX.Element {
    const d = new Date(date)

    return (
      <div>
        <div className="clock">
          <div className="wrap">
            <span
              className="hour"
              style={{
                transform: `rotate(${d.getHours() * 30}deg)`,
              }}
            ></span>
            <span
              className="minute"
              style={{
                transform: `rotate(${d.getMinutes() * 6}deg)`,
              }}
            ></span>
            <span
              className="second"
              style={{
                transform: `rotate(${d.getSeconds() * 6}deg)`,
              }}
            ></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    )
  }
}
