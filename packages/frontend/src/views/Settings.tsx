export default function Settings() {
  const source = new EventSource('http://localhost:3000')

  source.addEventListener(
    'message',
    function (e) {
      console.log(e.data)
    },
    false,
  )

  source.addEventListener(
    'open',
    function (e) {
      console.log('open')
    },
    false,
  )
  source.addEventListener(
    'error',
    function (e) {
      console.log('error', e)
    },
    false,
  )

  return (
    <div>
      <h1>Settings</h1>
    </div>
  )
}
