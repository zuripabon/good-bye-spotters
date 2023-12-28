import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Moon implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, 2.0,  -50.0)
    private rotation: Vector = new Vector(0, 0, 0)
    private dimension: Vector = new Vector(0.5, 0.5, 0.5)
    private scale: number = 2.0
    private visible: boolean = true
    private geometry: Mesh

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'moon'
        this.geometry = Mesh.plane(glEngine.glContext, 32*8, 96*8, 64*8, 112*8, 1.0, 0.5)
    }

    getId():string {
        return this.id
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

    update(){}

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation,
            this.scale
        )
    }
}

export default Moon
