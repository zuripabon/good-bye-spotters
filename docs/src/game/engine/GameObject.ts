import Engine from "."
import Vector from "./Vector"

interface GameObject {
    update(delta: number, inputs: {[key:string]: boolean}):void
    draw(engine:Engine):void
    onCollide?(gameObjectId: string):void
    getCollider?():[Vector, Vector]
    onMouseMove?(x: number, y:number, delta: number):void
}

export default GameObject
