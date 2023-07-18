import React from 'react'
import { ModuleProps } from './Module'

/**
 * A module renderer is responsible for rendering the content that will be display on the dashboard
 * It should return a JSX.Element that will be server side rendered with the provider data.
 */
export default abstract class ModuleRenderer {
  /**
   * Define the CSS style of the module
   */
  protected abstract style: string

  /**
   * Defines the module render
   * @param data the data accessible to the renderer
   */
  protected abstract display(data: ModuleProps): React.JSX.Element

  /**
   *
   * @param data
   * @returns
   */
  public render(data: ModuleProps): React.JSX.Element {
    return (
      <>
        <style>{this.style}</style>
        {this.display(data)}
      </>
    )
  }
}
