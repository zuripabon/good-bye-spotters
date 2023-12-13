import Vector from "./engine/Vector"
import Mesh from "./engine/Mesh"
import Engine from "./engine"
import GameObject from "./engine/GameObject"
import ConversationDialog from "./engine/ConversationDialog"
import { priestDialog } from "./dialogs"

class Priest implements GameObject {

    private position:Vector = new Vector(0, 0.3, 0)
    private dimension:Vector = new Vector(0.015, 0.30,  0.05)
    private scale: number = 1.0
    private geometry: Mesh
    private dialog:ConversationDialog

    constructor(glEngine: Engine){
        this.geometry = Mesh.plane(glEngine.glContext, 512, 0, 640, 254, 0.13, 0.30)
        this.dialog = new ConversationDialog(priestDialog)
    }

    update(_: number, inputs: {[key:string]: boolean} = {}){
        if(inputs.Space){
            this.dialog.next()
            if(this.dialog.isDialogOver()){
                console.log('go next scene')
            }
        }
        if(inputs.KeyY){
            this.dialog.yes()
        }
        if(inputs.KeyN){
            this.dialog.no()
        }
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position.x, 
            this.position.y, 
            this.position.z, 
            this.scale
        )
    }

    getCollider():[Vector, Vector] {
        const minBorderBox = this.position.subtract(this.dimension);
        const maxBorderBox = this.position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

    onCollideEnter(): void {
        this.dialog.start()
    }

    onCollideLeave(): void {
        this.dialog.end()
    }
}

export default Priest
