import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { ComposalStampRFIDProps } from '.'

export default class ComposalStampRFIDRenderer extends ModuleRenderer {
  render({ status, additionalMessage, data }: ComposalStampRFIDProps): JSX.Element {
    const avatar = data?.avatar_url || '/assets/placeholder.svg'

    if (status === 'loading') {
      return (
        <div className="w-full h-full flex justify-center">
          <span className="loading loading-ring loading-lg"></span>
          {status}
        </div>
      )
    }

    if (status === 'start') {
      return (
        <div className="card bg-base-100">
          <div className="card-body flex flex-row items-center">
            <div className="mask mask-squircle w-28 h-28">
              <img src={avatar} />
            </div>
            <div className="ml-2 w-full">
              <h2 className="card-title text-2xl">Welcome {data.display_name} !</h2>

              <p className="mb-2 flex items-center justify-between w-full">
                <div>You just clocked in !</div>
                <span className="text-4xl font-bold">{data.clocked_in_at}</span>
              </p>

              <div className="card-actions justify-end">{additionalMessage}</div>
            </div>
          </div>
        </div>
      )
    }

    if (status === 'end') {
      return (
        <div className="card bg-base-100">
          <div className="card-body flex flex-row items-center">
            <img src={avatar} className="w-28 h-28 mask mask-squircle" />
            <div className="ml-2 w-full">
              <h2 className="card-title text-2xl">Goodbye {data.display_name} !</h2>

              <p className="mb-2 flex items-center justify-between w-full">
                <div>You just clocked out !</div>
                <span className="text-4xl font-bold">17:00</span>
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (status === 'error') {
      return (
        <div className="p-6 bg-warning border border-gray-200 rounded-lg shadow text-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 italic">{additionalMessage}</h5>
        </div>
      )
    }

    // Default status is 'idle'
    return (
      <div className="w-full h-full flex justify-center">
        <h2 className="card-title text-2xl p-6">Please scan your card</h2>
      </div>
    )
  }
}
