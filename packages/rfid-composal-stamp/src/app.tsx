import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { ComposalStampRFIDProps } from '.'

export default class ComposalStampRFIDRenderer extends ModuleRenderer {
  render({ status, additionalMessage, data }: ComposalStampRFIDProps): JSX.Element {
    const avatar = data?.avatar_url || '/assets/placeholder.svg'

    if (status === 'loading') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )
    }

    if (status === 'start') {
      return (
        <div className="rounded overflow-hidden shadow-lg w-full h-full">
          <img className="h-28 object-cover md:w-28 mx-auto" src={avatar} alt="user_avatar" width="100" height="100"/>
          <div className="px-6 py-4">
            <div className="uppercase tracking-wide text-indigo-500 font-semibold text-center text-2xl">Welcome !</div>
            <span className="block mt-1 text-xl leading-tight font-medium text-black text-center">
              {data.display_name}
            </span>
            <div className="mt-4">
              <div className="text-xl font-bold text-center">You just clocked in at {data.clocked_in_at}.</div>
              <div className="text-center">{additionalMessage}</div>
            </div>
          </div>
        </div>
      )
    }

    if (status === 'end') {
      return (
        <div className="rounded overflow-hidden shadow-lg w-full h-full">
          <img className="h-28 object-cover md:w-28 mx-auto" src={avatar} alt="user_avatar" />
          <div className="px-6 py-4">
            <div className="uppercase tracking-wide text-indigo-500 font-semibold text-center text-2xl">Goodbye !</div>
            <span className="block mt-1 text-xl leading-tight font-medium text-black text-center">
              {data.display_name}
            </span>
            <div className="mt-4">
              <div className="text-xl font-bold text-center">You just clocked in at {data.clocked_in_at}.</div>
              <div className="text-center">{additionalMessage}</div>
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
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-2xl font-bold">Please scan your card</span>
      </div>
    )
  }
}
