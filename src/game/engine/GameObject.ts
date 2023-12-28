import Engine from "."
import Vector from "./Vector"

interface GameObject {
    getId():string
    getPosition():Vector
    setPosition(x:number|null, y:number|null, z:number|null): void
    isVisible():boolean
    setVisible(visible: boolean): void
    getRotation(): Vector
    setRotation(x:number|null, y:number|null, z:number|null): void
    update(delta: number, inputs: {[key:string]: boolean}):void
    draw(engine:Engine):void
    onSceneEnter?(sceneId: string): void
    onSceneLeave?(sceneId: string): void
    getCollider?():[Vector, Vector]
    onCollideEnter?(gameObjectId: string, sceneId: string):void
    onCollideLeave?(gameObjectId: string, sceneId: string):void
    onMouseMove?(x: number, y:number, delta: number):void
    onMouseDown?(x: number, y:number, delta: number):void
    onMouseUp?(x: number, y:number, delta: number):void
}

export default GameObject
