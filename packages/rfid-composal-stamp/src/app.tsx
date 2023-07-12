import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { ComposalStampRFIDProps } from '.'

export default class ComposalStampRFIDRenderer extends ModuleRenderer {
  readonly style = `
  .container {
    overflow: hidden; 
    margin-top: 1rem;
    margin-bottom: 1rem; 
    border-radius: 0.5rem; 
    max-width: 24rem; 
    background-color: #ffffff; 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
  }
  
  .container > img {
    object-fit: cover; 
    object-position: center; 
    width: 100%; 
    height: 14rem; 
  }
  
  .banner {
    display: flex; 
    padding-top: 0.75rem;
    padding-bottom: 0.75rem; 
    padding-left: 1.5rem;
    padding-right: 1.5rem; 
    align-items: center; 
    background-color: #111827; 
  }
  
  .banner > h1 {
    font-size: 1.125rem;
    line-height: 1.75rem; 
    font-weight: 600; 
    color: white; 
  }
  
  .content {
    padding-top: 1rem;
    padding-bottom: 1rem; 
    padding-left: 1.5rem;
    padding-right: 1.5rem; 
    text-align: center; 
  }
  
  .content > .title {
    font-size: 1.5rem;
    line-height: 2rem; 
    font-weight: 600; 
    color: #1F2937; 
  }
  
  .content > .hour {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem; 
    font-size: 3rem;
    line-height: 1; 
    font-weight: 700; 
  }
  
  .content > .details {
    display: flex; 
    margin-top: 1rem; 
    align-items: center; 
  }

  .idle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .idle > img {
    width: 100px;
    height: 100px;
    padding: 1rem; 
    border-radius: 0.75rem; 
    backdrop-filter: blur(12px); 
    filter: invert(100%);
  }

  .idle > span {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1F2937;
  }
`

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
        <>
          <style>{this.style}</style>
          <div className="container">
            <img src={avatar} alt="user_avatar" />
            <div className="banner">
              <h1>Clocked in !</h1>
            </div>
            <div className="content">
              <h1 className="title">{data.display_name}</h1>
              <p className="hour">{data.clocked_in_at}</p>
              <div className="details">{additionalMessage}</div>
            </div>
          </div>
        </>
      )
    }

    if (status === 'end') {
      return (
        <>
          <style>{this.style}</style>
          <div className="container">
            <img src={avatar} alt="user_avatar" />
            <div className="banner">
              <h1>Clocked out !</h1>
            </div>
            <div className="content">
              <h1 className="title">{data.display_name}</h1>
              <p className="hour">{data.clocked_in_at}</p>
              <div className="details">{additionalMessage}</div>
            </div>
          </div>
        </>
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
      <>
        <style>{this.style}</style>
        <div className="idle">
          <img src="https://composal.ch/images/logo-composal@2x.png" alt="composal_logo" />
          <span className="text-2xl font-bold">Please scan your card</span>
        </div>
      </>
    )
  }
}
