import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import ConversationDialog from "../engine/ConversationDialog"
import { priestDialog } from "./dialogs"

class Priest implements GameObject {

    protected id:string 
    protected position:Vector = new Vector(0, 0.3, 0)
    protected rotation: Vector = new Vector(0, 0, 0)
    protected dimension:Vector = new Vector(0.015, 0.30,  0.05)
    protected scale: number = 1.0
    protected visible: boolean = true
    protected geometry: Mesh
    protected dialog:ConversationDialog | undefined
    protected engine:Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'priest'
        this.engine = glEngine
        this.geometry = Mesh.plane(this.engine.glContext, 512, 0, 640, 254, 0.13, 0.30)
        this.setDialog()
    }

    getId():string {
        return this.id
    }

    getPosition(): Vector {
        return this.position
    }

    setPosition(x:number|null, y:number|null, z:number|null): void {
        this.position.x = x !== null ? x : this.position.x
        this.position.y = y !== null ? y : this.position.y
        this.position.z = z !== null ? z : this.position.z
    }

    getRotation(): Vector {
        return this.rotation
    }

    setRotation(x:number|null, y:number|null, z:number|null): void {
        this.rotation.x = x !== null ? x : this.rotation.x
        this.rotation.y = y !== null ? y : this.rotation.y
        this.rotation.z = z !== null ? z : this.rotation.z
    }

    isVisible(): boolean {
        return this.visible
    }

    setVisible(visible: boolean): void {
        this.visible = visible
    }

    setDialog(dialog = priestDialog, storageKey = 'priestDialog'){
        this.dialog = new ConversationDialog(dialog, storageKey)
        this.dialog.onEnd(() => {
            this.engine.setScene('world')
            this.engine.sound.play('challengeAccepted')
            return null
        })
    } 

    update(){

        this.rotation.y = Math.atan2( -this.engine.getCamera().getPosition().x - this.position.x, -this.engine.getCamera().getPosition().z - this.position.z ) * ( 180 / Math.PI );
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation,
            this.scale
        )
    }

    getCollider():[Vector, Vector] {
        const minBorderBox = this.position.subtract(this.dimension);
        const maxBorderBox = this.position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

    onCollideEnter(gameObjectId: string): void {
        if(gameObjectId === 'camera'){
            this.dialog?.start()
        }
    }
}

export default Priest
