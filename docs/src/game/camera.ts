import Vector from "./engine/Vector"
import { clamp } from './engine/utils'

class Camera {

    private rotation: Vector = new Vector(0,0,0)
    private position: Vector = new Vector(0,0,0)

    private constructor(x:number, y:number, z:number){
        this.position = new Vector(x, y, z)
    }

    getPosition():Vector{
        return this.position
    }

    getRotation():Vector{
        return this.rotation
    }

    onMouseMove(x:number, y:number, lastDelta: number){
        this.rotation.x += y * lastDelta * 4.0;
        this.rotation.x = clamp(this.rotation.x, -90, 90); // unless you wanna break your neck ;)
        
        this.rotation.y += x * lastDelta * 4.0;
    }

    update(delta: number, inputs: {[key:string]: boolean} = {}){
        let speed = 0.0
        let side = 0.0
        let strife = 0.0

        if(inputs.KeyW || inputs.ArrowUp){
            speed = -delta * 1.0
        }
        
        if(inputs.KeyS || inputs.ArrowDown){
            speed = delta * 1.0
        }
        
        if(inputs.KeyD || inputs.ArrowRight){
            side = 90
            strife = -delta
        }
        
        if(inputs.KeyA || inputs.ArrowLeft){
            side = -90
            strife = -delta
        }

        const angleY = this.rotation.y
        const strafeRot = (angleY + side) * 3.14/180
        const stepRot = (angleY) * 3.14/180;

        // step 1: update strafing
        this.position.x += Math.sin(strafeRot) * strife;
        this.position.z -= Math.cos(strafeRot) * strife;

        // step 2: update step (move forward / backwards)
        this.position.x += Math.sin(stepRot) * speed;
        this.position.z -= Math.cos(stepRot) * speed;
    }

    static create(x:number, y:number, z:number){
        const camera = new Camera(x, y, z)
        return camera
    }
}

export default Camera
