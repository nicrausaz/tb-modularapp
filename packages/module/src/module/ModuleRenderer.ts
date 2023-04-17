import { ModuleProps } from "./Module";

export default abstract class ModuleRenderer {
  abstract render(data: ModuleProps): JSX.Element
}