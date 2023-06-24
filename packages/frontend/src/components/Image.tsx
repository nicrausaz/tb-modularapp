type ImageProps = {
  src: string
  alt: string
  fallback?: string
  className?: string
  width?: number
  height?: number
}

/**
 * A wrapper around the <img> tag that allows for a fallback image to be used if the src image fails to load.
 */
export default function Image(props: ImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (props.fallback) {
      const target = e.currentTarget as HTMLImageElement
      target.src = props.fallback
    }
  }

  return <img {...props} onError={handleError} />
}
