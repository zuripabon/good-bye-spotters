import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Moon implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, 2.0,  -50.0)
    private dimension: Vector = new Vector(0.5, 0.5, 0.5)
    private scale: number = 1.0
    private geometry: Mesh

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'moon'
        this.geometry = Mesh.plane(glEngine.glContext, 32*8, 96*8, 64*8, 112*8, 1.0, 0.5)
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

export default Moon
