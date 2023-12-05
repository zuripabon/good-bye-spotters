
import quotesLogo from '../assets/quotes.svg'
import landingPicture from '../assets/landing.jpg'

function Landing({ onClick } : { onClick: () => void }) {

  return ( 
    <section className="landing">
      <div className="landing-image hi-there">
        <img id="gameTrigger" src={landingPicture} alt="Francesco" onClick={onClick}/>
      </div>
      <div className="landing-text">
        <img src={quotesLogo}  width="45" height="38" />
        <p className="landing-p">I found a nice room and within minutes of sending my booking request I was accepted.</p>
        <p className="landing-q">- Francesco, Barcelona</p>
      </div>
    </section>
  )
}

export default Landing
