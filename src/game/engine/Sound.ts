import { zzfx } from './audio/zzfx.js'
import {audioContext} from "./audio/context.js";

class Sound {

  private samples: {[key:string]: (number | undefined)[]} = {}
  private intervals: {[key:string]: number} = {}

  loadSample(key:string, sample: (number | undefined)[]){
    this.samples[key] = sample
  }

  play(key:string){
    if(!document.hasFocus()){
      return
    }
    const source = audioContext.createBufferSource();
    source.buffer = zzfx(this.samples[key] as number[]);
    source.connect(audioContext.destination);
    source.start();
  }  
  
  playAt(key:string, interval:number){
    
    if(this.intervals[key] === undefined){
      this.intervals[key] = new Date().getTime()
      return this.play(key)
    }

    const now = new Date().getTime()

    if(now - this.intervals[key] >= interval){
      this.intervals[key] = now
      return this.play(key)
    }

  }

}

export default Sound