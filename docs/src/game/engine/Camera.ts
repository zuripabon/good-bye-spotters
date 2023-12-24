
import Vector from "./Vector"
import GameObject from "./GameObject"
import Engine from "."

class Camera implements GameObject {

    protected dimension:Vector = new Vector(0, 0, 0)
    protected rotation: Vector = new Vector(0, 0, 0)
    protected position: Vector = new Vector(0, 0, 0)

    constructor(position?: Vector, rotation?:Vector, dimension?: Vector) {
        if(position){
            this.position = position
        }
        if(rotation){
            this.rotation = rotation
        }
        if(dimension){
            this.dimension = dimension
        }
    }

    getId():string {
        return 'camera'
    }

    getPosition(): Vector {
        return this.position
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(delta: number, inputs: {[key:string]: boolean}){
        
    }

    draw(glEngine: Engine):void {
        glEngine.rotate(this.rotation.x, 1, 0, 0);
        glEngine.rotate(this.rotation.y, 0, 1, 0);
        glEngine.translate(this.position.x, this.position.y, this.position.z);
    }

    getCollider():[Vector, Vector] {
        // it's negative because the camera gets translated by the positive axis
        const position = new Vector(-this.position.x, -this.position.y, -this.position.z)
        const minBorderBox = position.subtract(this.dimension);
        const maxBorderBox = position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCollideEnter(gameObjectId: string, sceneId: string): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCollideLeave(gameObjectId: string, sceneId: string): void {
        return;
    }

}

export default Camera
