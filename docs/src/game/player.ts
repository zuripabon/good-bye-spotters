import Vector from "./engine/Vector"
import { clamp } from './engine/utils'
import Camera from "./engine/Camera"
import Engine from "./engine";

class Player extends Camera {

    private canMove:boolean = true
    private engine: Engine

    constructor(glEngine: Engine){

        super(
            new Vector(0.0, -0.45, -1.0),
            new Vector(0, 0, 0),
            new Vector(0.25,  0.25,  0.25)
        )

        this.engine = glEngine
    }

    update(delta: number, inputs: {[key:string]: boolean} = {}){
        
        if(!this.canMove){
            return
        }

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

        // this.position.x = clamp(this.position.x, -4.0, 4.0);
        // this.position.z = clamp(this.position.z, -1.2, 39.8);
    }

    onMouseMove(x:number, y:number, lastDelta: number){
        this.rotation.x += y * lastDelta * 4.0;
        this.rotation.x = clamp(this.rotation.x, -90, 90); // unless you wanna break your neck ;)
        
        this.rotation.y += x * lastDelta * 4.0;
    }

    onSceneEnter(sceneId: string): void {
        if(sceneId === 'world'){
            this.engine.setShadersUniforms(1.0, [0.26, 0.26])
            this.position.x = 0.0
            this.position.y = -0.45
            this.position.z = -1.0
            this.rotation.x = 0
            this.rotation.y = 0
            this.canMove = true
        }
    }

    onCollideEnter(gameObjectId: string, sceneId: string): void {
        if(sceneId === 'lobby' && gameObjectId === 'priest'){
            this.canMove = false
        }
    }
}

export default Player
