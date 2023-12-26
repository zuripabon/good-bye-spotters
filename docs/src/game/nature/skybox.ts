import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Skybox implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, -3.4, 0)
    private rotation: Vector = new Vector(0, 0, 0)
    private scale: number = 5
    private visible: boolean = true
    private geometry: Mesh
    private engine: Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'skybox'
        this.geometry = Mesh.box(glEngine.glContext, 1, "C")
        this.engine = glEngine
    }

    getId():string {
        return this.id
    }

    
    isVisible(): boolean {
        return this.visible
    }

    setVisible(visible: boolean): void {
        this.visible = visible
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

    update(){
        this.position.x = -this.engine.getCamera().getPosition().x
        this.position.z = -this.engine.getCamera().getPosition().z
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation, 
            this.scale
        )
    }
}

export default Skybox
