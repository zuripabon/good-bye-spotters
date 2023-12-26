import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import ConversationDialog from "../engine/ConversationDialog"
import { npcDialogs } from "./dialogs"

export enum NpcTypes {
    npc0 = 'npc0',
    npc1 = 'npc1',
    npc2 = 'npc2',
    npc3 = 'npc3',
    npc4 = 'npc4',
    npc5 = 'npc5',
}

const NPC_MESHES = {
    [NpcTypes.npc0]: [0,         0,  15*8,     31*8,     0.13,   0.30],
    [NpcTypes.npc1]: [32*8,      0,  47*8,     31*8,     0.13,   0.30],
    [NpcTypes.npc2]: [48*8,      0,  63*8,     31*8,     0.13,   0.30],
    [NpcTypes.npc3]: [80*8,      0,  95*8,     31*8,     0.13,   0.30],
    [NpcTypes.npc4]: [96*8,      0,  111*8,    31*8,     0.13,   0.30],
    [NpcTypes.npc5]: [112*8,     0,  128*8,    31*8,     0.13,   0.30],
}

class Npc implements GameObject {

    private id:string 
    private position:Vector = new Vector(0, 0.3, 0)
    private dimension:Vector = new Vector(0.015, 0.30,  0.05)
    private scale: number = 1.0 
    private angle: number = 0.0
    private light: number = 1.0
    private visible: boolean = true
    private geometry: Mesh
    private dialog:ConversationDialog
    private engine:Engine

    constructor(glEngine: Engine, id: NpcTypes){
        this.id = id || 'Enemy'
        this.engine = glEngine

        const npcMesh = NPC_MESHES[id]
        this.geometry = Mesh.plane(glEngine.glContext, npcMesh[0], npcMesh[1], npcMesh[2], npcMesh[3], npcMesh[4], npcMesh[5])

        this.dialog = new ConversationDialog(npcDialogs[id])
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

    setLight(light: number){
        this.light= light
    }

    getPosition(): Vector {
        return this.position
    }

    isVisible(): boolean {
        return this.visible
    }

    setVisible(visible: boolean): void {
        this.visible = visible
    }

    update(_: number, inputs: {[key:string]: boolean} = {}){

        if(this.dialog.hasStarted){

            if(inputs.Space){
                this.dialog.next()
                if(this.dialog.isDialogOver()){
                    this.dialog.end()
                    this.engine.getGameObjectById('shotgun')?.setVisible(true)
                    // this.engine.setScene('lobby')
                    return;
                }
            }

            if(inputs.KeyY){
                this.dialog.yes()
            }
            if(inputs.KeyN){
                this.dialog.no()
            }

        }

        this.angle = Math.atan2( -this.engine.getCamera().getPosition().x - this.position.x, -this.engine.getCamera().getPosition().z - this.position.z ) * ( 180 / Math.PI );
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position.x, 
            this.position.y, 
            this.position.z, 
            this.scale,
            this.angle,
            this.light
        )
    }

    getCollider():[Vector, Vector] {
        const minBorderBox = this.position.subtract(this.dimension);
        const maxBorderBox = this.position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

    onCollideEnter(): void {
        console.log('colliding', this.id)
        this.dialog.start()
    }

    onCollideLeave(): void {
        this.dialog.end()
    }
}

export default Npc
