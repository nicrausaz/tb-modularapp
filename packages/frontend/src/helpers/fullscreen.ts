/**
 * Augments the declaration of Document to handle fullscreen compatibility in various browsers
 */
type ExitFullscreen = typeof document.exitFullscreen
type RequestFullscreen = typeof document.documentElement.requestFullscreen

declare global {
  interface Document {
    webkitExitFullscreen: ExitFullscreen // Safari
    mozCancelFullScreen: ExitFullscreen // Firefox
    msExitFullscreen: ExitFullscreen // IE
  }

  interface HTMLElement {
    webkitRequestFullscreen: RequestFullscreen // Safari
    mozRequestFullScreen: RequestFullscreen // Firefox
    msRequestFullscreen: RequestFullscreen // IE
  }
}

export const fullscreen = (element?: HTMLElement): void => {
  if (!element) {
    element = document.documentElement
  }

  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

/**
 * Disable browser window fullscreen
 */
export const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
