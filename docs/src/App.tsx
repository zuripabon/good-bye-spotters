
import { useState, useRef } from 'react'
import Landing from './components/Landing'
import Dialog from './components/Dialog'
import Footer from './components/Footer'
import Game from './game'
import texture from './assets/texture.png'

import './App.css'

function App() {

  const [isVisible, setVisible] = useState(false);
  const imageRef = useRef(null)
  
  const handleOnLoadTexture = () => {
    setVisible(true)
  }

  const handleOnClick = () => {
    Game.run(imageRef.current as unknown as HTMLImageElement);
  }

  return (
    <main>
      {isVisible && <Landing onClick={handleOnClick}/>}
      <Dialog/>
      <Footer/>
      <img src={texture} ref={imageRef} hidden onLoad={handleOnLoadTexture}/>
    </main>
  )
}

export default App
