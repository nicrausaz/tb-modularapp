import * as icons from '@/assets/icons'

type IconProps = {
  name: string
}

export default function Icon({ name, ...props }: IconProps) {
  const Icon = icons[name as keyof typeof icons]

  return <Icon {...props} />
}
