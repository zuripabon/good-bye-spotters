import Vector from "./Vector"

interface Camera {
    getPosition():Vector
    getRotation():Vector
    update(delta: number, inputs: {[key:string]: boolean}):void
    onMouseMove(x: number, y:number, delta: number):void
}

export default Camera
