import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class TreeBush implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, 0,  0)
    private rotation: Vector = new Vector(0, 0, 0)
    private scale: number = 1.0
    private visible: boolean = true
    private geometry: Mesh
    private engine: Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'treeBush'
        this.geometry = Mesh.plane(glEngine.glContext, 80*8, 63*8, 95*8, 79*8, 0.20, 0.20)
        this.engine = glEngine
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

    update(){
        this.rotation.y = Math.atan2( -this.engine.getCamera().getPosition().x - this.position.x, -this.engine.getCamera().getPosition().z - this.position.z ) * ( 180 / Math.PI );
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation,
            this.scale,
        )
    }
}

export default TreeBush
