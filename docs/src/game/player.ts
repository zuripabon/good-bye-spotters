import Vector from "./engine/Vector"
import Engine from "./engine"
import GameObject from "./engine/GameObject"
import { clamp } from './engine/utils'

class Player implements GameObject {

    private dimension:Vector = new Vector(0.25,  0.25,  0.25)
    private rotation: Vector = new Vector(0, 0, 0)
    private position: Vector = new Vector(0.0, -0.45, -1.0)

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

    draw(glEngine: Engine):void { 
        glEngine.rotate(this.rotation.x, 1, 0, 0);
        glEngine.rotate(this.rotation.y, 0, 1, 0);
        glEngine.translate(this.position.x, this.position.y, this.position.z);
    }

    onMouseMove(x:number, y:number, lastDelta: number){
        this.rotation.x += y * lastDelta * 4.0;
        this.rotation.x = clamp(this.rotation.x, -90, 90); // unless you wanna break your neck ;)
        
        this.rotation.y += x * lastDelta * 4.0;
    }

    getCollider():[Vector, Vector] {
        // it's negative because the camera gets translated by the positive axis
        const position = new Vector(-this.position.x, -this.position.y, -this.position.z)
        const minBorderBox = position.subtract(this.dimension);
        const maxBorderBox = position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

    onCollide(gameObjectId: string): void {
        console.log(`player says: colliding ${gameObjectId}`)
    }
}

export default Player
