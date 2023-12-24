import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Castle implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, 0.75, -40.0)
    private dimension: Vector = new Vector(0.5, 0.5, 0.5)
    private scale: number = 1.5
    private geometry: Mesh

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'castle'
        this.geometry = Mesh.plane(glEngine.glContext, 32*8, 80*8, 63*8, 96*8, 1.0, 0.50)
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

export default Castle
