import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class TreeBush implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, 0,  0)
    private dimension: Vector = new Vector(0.05, 0.2, 0.05)
    private scale: number = 1.0
    private angle: number = 0.0
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

    setPosition(x:number, y:number, z:number): void {
        this.position = new Vector(x, y, z)
    }
    
    isVisible(): boolean {
        return this.visible
    }

    setVisible(visible: boolean): void {
        this.visible = visible
    }

    update(){
        this.angle = Math.atan2( -this.engine.getCamera().getPosition().x - this.position.x, -this.engine.getCamera().getPosition().z - this.position.z ) * ( 180 / Math.PI );
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position.x, 
            this.position.y, 
            this.position.z, 
            this.scale,
            this.angle
        )
    }
}

export default TreeBush
