import React from 'react'

export default function render() {

  const [counter, setCounter] = React.useState(0)

  React.useEffect(() => {
    setInterval(() => {
      setCounter((counter) => counter + 1)
    }, 1000)
  }, [])

  return (<h1>Hello world from the render function {counter}</h1>)
}
