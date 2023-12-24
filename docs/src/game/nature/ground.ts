import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Ground implements GameObject {

    private id:string 
    private position: Vector = new Vector(0,0,0)
    private scale: number = 100.0
    private geometry: Mesh

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'ground'
        this.geometry = Mesh.box(glEngine.glContext, 1, "G")
    }

    getId():string {
        return this.id
    }

    getPosition(): Vector {
        return this.position
    }

    update(){}

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

export default Ground
