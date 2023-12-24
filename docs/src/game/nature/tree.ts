import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Tree implements GameObject {

    private id:string 
    private position: Vector = new Vector(0, 0,  0)
    private dimension: Vector = new Vector(0.015, 0.5, 0.015)
    private scale: number = 1.0
    private geometry: Mesh

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'tree'
        this.geometry = Mesh.plane(glEngine.glContext, 96*8, 64*8, 112*8, 95*8, 0.35, 0.70)
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

export default Tree
