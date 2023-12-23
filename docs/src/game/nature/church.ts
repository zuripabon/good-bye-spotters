import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Church implements GameObject {

    private id:string 
    private position: Vector = new Vector(0,0,0)
    private scale: number = 1.0
    private geometry: Mesh

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'priest'
        this.geometry = Mesh.box(glEngine.glContext, 0, "LRGCFB")
    }

    getId():string {
        return this.id
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

export default Church
