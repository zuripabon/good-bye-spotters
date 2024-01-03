
import {useState, useEffect } from 'react'
import wasdPicture from '../assets/wasd.png'
import mousePicture from '../assets/mouse.png'

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
      <img src={wasdPicture} width="100" height="60" />
      <img src={mousePicture} width="60" height="60"/>
    </section>
  )
}

export default Hint
