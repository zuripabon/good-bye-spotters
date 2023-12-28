
import {useState, useEffect } from 'react'

const SECONDS_TO_SHOW = 5

function Hint() {

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setTimeout(() => setVisible(false), 1000 * SECONDS_TO_SHOW)
  }, [])

  if(!visible) {
    return null
  }

  return ( 
    <section className="hint">
      <img src="/wasd.png" width="100" height="60" />
      <img src="/mouse.png" width="60" height="60"/>
    </section>
  )
}

export default Hint
