import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import { winDialog } from "./dialogs"
import SequentialDialog from "../engine/SequentialDialog"
import { clamp } from "../engine/utils"

class Win implements GameObject {

    protected id:string 
    protected position:Vector = new Vector(0, 0.3, 0)
    protected rotation: Vector = new Vector(0, 0, 0)
    protected dimension:Vector = new Vector(0.015, 0.30,  0.05)
    protected scale: number = 1.0
    protected visible: boolean = true
    protected geometry: Mesh
    protected dialog:SequentialDialog | undefined
    protected engine:Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'priest'
        this.engine = glEngine
        this.geometry = Mesh.plane(this.engine.glContext, 16*8, 0, 31*8, 31*8, 0.13, 0.30)
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

    setDialog(dialog = winDialog){
        this.dialog = new SequentialDialog(dialog)
        this.dialog.onEnd(() => {
            this.dialog?.start(dialog.length -1)
            return null
        })
    } 

    update(){
        const { sky } = this.engine.getShadersUniforms()
        const sky0 = sky[0] + 0.01
        const sky1 = sky[1] + 0.01
        this.engine.setShadersUniforms(
            1.0, 
            [
                clamp(sky0 > 0.6 ? 0.5 : sky0, 0.5, 0.6), 
                clamp(sky1 > 0.6 ? 0.5 : sky1, 0.5, 0.6)
            ]
        )
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

    onSceneEnter(): void {
        localStorage.setItem('finish', 'true')
        this.dialog?.start()
    }
}

export default Win
