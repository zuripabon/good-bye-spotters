import Engine from "."
import Vector from "./Vector"

interface GameObject {
    getId():string
    getPosition():Vector
    update(delta: number, inputs: {[key:string]: boolean}):void
    draw(engine:Engine):void
    onSceneEnter?(sceneId: string): void
    onSceneLeave?(sceneId: string): void
    getCollider?():[Vector, Vector]
    onCollideEnter?(gameObjectId: string, sceneId: string):void
    onCollideLeave?(gameObjectId: string, sceneId: string):void
    onMouseMove?(x: number, y:number, delta: number):void
}

export default GameObject
