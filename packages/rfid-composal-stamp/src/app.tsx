import React from 'react'
import { ModuleRenderer } from '@yalk/module'
import { ComposalStampRFIDProps } from '.'

export default class ComposalStampRFIDRenderer extends ModuleRenderer {
  readonly style = `
  .stamp-card {
    overflow: hidden; 
    border-radius: 0.5rem; 
    background-color: #ffffff;
    width: 100%;
    height: 100%;
  }
  
  .avatar {
    object-fit: cover; 
    object-position: center; 
    width: 100%; 
    height: 30%; 
  }
  
  .banner {
    display: flex; 
    padding-top: 0.75rem;
    padding-bottom: 0.75rem; 
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    align-items: center; 
    background-color: #2065d1;
    color: white; 
  }
  
  .content {
    padding-top: 1rem;
    padding-bottom: 1rem; 
    padding-left: 1.5rem;
    padding-right: 1.5rem; 
    text-align: center; 
  }
  
  .content-title {
    font-size: 1.5rem;
    line-height: 2rem; 
    font-weight: 600; 
    color: #1F2937; 
  }
  
  .content-hour {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem; 
    line-height: 1;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .content-details {
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

  .idle-img {
    width: 100px;
    height: 100px;
    padding: 1rem; 
    border-radius: 0.75rem; 
    backdrop-filter: blur(12px);
    background-color: lightgray;
  }

  .idle-details {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1F2937;
  }

  .loading-img {
    width: 100px;
    height: 100px;
    padding: 1rem; 
    border-radius: 0.75rem; 
    backdrop-filter: blur(12px);
    background-color: lightgray;
  }
`

  render({ status, additionalMessage, data }: ComposalStampRFIDProps): JSX.Element {
    const avatar = data?.avatar_url || '/assets/placeholder.svg'

    if (status === 'loading') {
      return (
        <>
          <style>{this.style}</style>
          <div className="idle">
            <img className="loading-img" src="https://test.crausaz.click/composal.svg" alt="composal_logo" />
            <span className="idle-details">Loading</span>
          </div>
        </>
      )
    }

    if (status === 'start') {
      return (
        <>
          <style>{this.style}</style>
          <div className="stamp-card">
            <img src={avatar} alt="user_avatar" className="avatar" />
            <div className="banner">
              <h1>Clocked in ! ⏳</h1>
            </div>
            <div className="content">
              <h1 className="content-title">{data.display_name}</h1>
              <p className="content-hour">{data.clocked_in_at}</p>
              <div className="content-details">{additionalMessage} ⏰</div>
            </div>
          </div>
        </>
      )
    }

    if (status === 'end') {
      return (
        <>
          <style>{this.style}</style>
          <div className="stamp-card">
            <img src={avatar} alt="user_avatar" className="avatar" />
            <div className="banner">
              <h1>Clocked out ! ⌛</h1>
            </div>
            <div className="content">
              <h1 className="content-title">{data.display_name}</h1>
              <p className="content-hour">{data.clocked_in_at}</p>
              <div className="content-details">{additionalMessage} ⏰</div>
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
          <img className="idle-img" src="https://test.crausaz.click/composal.svg" alt="composal_logo" />
          <span className="idle-details">Please scan your card</span>
        </div>
      </>
    )
  }
}
