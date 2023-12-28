
import Vector from "./Vector"
import GameObject from "./GameObject"
import Engine from "."

class Camera implements GameObject {

    protected dimension:Vector = new Vector(0, 0, 0)
    protected rotation: Vector = new Vector(0, 0, 0)
    protected position: Vector = new Vector(0, 0, 0)
    private visible: boolean = true

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

    setPosition(x:number|null, y:number|null, z:number|null): void {
        this.position.x = x !== null ? x : this.position.x
        this.position.y = y !== null ? y : this.position.y
        this.position.z = z !== null ? z : this.position.z
    }

    getRotation(): Vector {
        return this.rotation
    }

    setRotation(x:number|null, y:number|null, z:number|null): void {
        this.rotation.x = x !== null ? x : this.rotation.x
        this.rotation.y = y !== null ? y : this.rotation.y
        this.rotation.z = z !== null ? z : this.rotation.z
    }

    isVisible(): boolean {
        return this.visible
    }

    setVisible(visible: boolean): void {
        this.visible = visible
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_: number, _2: {[key:string]: boolean}){
        
    }

    draw(glEngine: Engine):void {
        glEngine.modelView.rotate(this.rotation.x, 1, 0, 0);
        glEngine.modelView.rotate(this.rotation.y, 0, 1, 0);
        glEngine.modelView.translate(this.position.x, this.position.y, this.position.z);
    }

    getCollider():[Vector, Vector] {
        // it's negative because the camera gets translated by the positive axis
        const position = new Vector(-this.position.x, -this.position.y, -this.position.z)
        const minBorderBox = position.subtract(this.dimension);
        const maxBorderBox = position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

}

export default Camera
