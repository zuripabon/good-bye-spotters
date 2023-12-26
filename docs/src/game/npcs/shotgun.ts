import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Shotgun implements GameObject {

    private id:string 
    private position: Vector = new Vector(0.2,   -0.1,  -0.18)
    private dimension: Vector = new Vector(0 , 0, 0)
    private scale: number = 0.3
    private angle:number = 0.0
    private visible: boolean = false
    private geometry: Mesh
    private engine: Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'shotgun'
        this.geometry = Mesh.box(glEngine.glContext, 2, "LC")
        this.engine = glEngine
    }

    getId():string {
        return this.id
    }

    setPosition(x:number, y:number, z:number): void {
        this.position = new Vector(x, y, z)
    }

    setScale(scale: number){
        this.scale = scale
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

    update(){
        this.position.x = -this.engine.getCamera().getPosition().x
        this.position.z = -this.engine.getCamera().getPosition().z - 0.5
        // this.position.y = -this.engine.getCamera().getPosition().y
    }

    draw(glEngine: Engine):void {
        // glEngine.modelView.pushMatrix()
        glEngine.drawObject(
            this.geometry, 
            this.position.x, 
            this.position.y, 
            this.position.z, 
            this.scale,
            this.angle
        )
        // glEngine.modelView.popMatrix()
    }

    getCollider():[Vector, Vector] {
        const minBorderBox = this.position.subtract(this.dimension);
        const maxBorderBox = this.position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }
}

export default Shotgun
