import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Skybox implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, -3.4, 0)
    private scale: number = 5.1
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

    getPosition(): Vector {
        return this.position
    }

    update(){
        this.position.x = -this.engine.getCamera().getPosition().x
        this.position.z = -this.engine.getCamera().getPosition().z
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position.x, 
            this.position.y, 
            this.position.z, 
            this.scale
        )
    }
}

export default Skybox
