import React from 'react'

type Props = {
  name: string
}

export default function render({ name }: Props) {
  return <h1>Hello world from the render {name}</h1>
}
