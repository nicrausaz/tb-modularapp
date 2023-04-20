import { ModuleProps } from './Module'

/**
 * A module renderer is responsible for rendering the content that will be display on the dashboard
 * It should return a JSX.Element that will be server side rendered with the provider data.
 */
export default abstract class ModuleRenderer {
  /**
   * Defines the module render
   * @param data the data accessible to the renderer
   */
  abstract render(data: ModuleProps): JSX.Element
}
