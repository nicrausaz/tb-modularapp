import { Suspense, lazy } from 'react'

type IconProps = {
  name: string
}

export default function LazyIcon({ name, ...props }: IconProps) {
  const Icon = lazy(() => import(/* @vite-ignore */ `../assets/icons/${name}`))
  return (
    <Suspense>
      <Icon {...props} />
    </Suspense>
  )
}
