import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import ConversationDialog from "../engine/ConversationDialog"
import { npcDialogs } from "./dialogs"
import { rn } from "../engine/utils"
import Enemy from "./enemy"

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
    private rotation: Vector = new Vector(0, 0, 0)
    private dimension:Vector = new Vector(0.015, 0.30,  0.05)
    private scale: number = 1.0 
    private light: number = 1.0
    private factor: number = 0
    private visible: boolean = true
    private timeToRespawn: number = 0
    private geometry: Mesh
    private dialog:ConversationDialog
    private engine:Engine

    constructor(glEngine: Engine, id: NpcTypes){
        this.id = id || 'npc'
        this.engine = glEngine

        const npcMesh = NPC_MESHES[id]
        this.geometry = Mesh.plane(glEngine.glContext, npcMesh[0], npcMesh[1], npcMesh[2], npcMesh[3], npcMesh[4], npcMesh[5])

        this.dialog = new ConversationDialog(npcDialogs[id])
    }

    getId():string {
        return this.id
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

    update(delta: number, inputs: {[key:string]: boolean} = {}){

        if(this.dialog.hasStarted){

            if(inputs.Space){
                this.dialog.next()
                if(this.dialog.isDialogOver()){
                    this.dialog.end()
                    this.engine.setState('enemyMode', true)
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

        if(this.engine.getState('enemyMode') === true){
            
            this.timeToRespawn += delta

            // Move NPC backwards
            this.position.z -= delta * 0.25
            // Transform into enemy texture
            // this.factor = clamp(this.factor + (this.engine.getLastDelta() * 2.0), 0.0, 1.0)

            if(this.timeToRespawn > 2.0){
                const enemy = new Enemy(this.engine)
                enemy.setPosition(rn(-4.0, 4.0), 0.3, -this.engine.getCamera().getPosition().z + rn(-5.0, 5.0))

                this.engine.createGameObject(enemy, 'world')
                this.engine.getGameObjectById('shotgun')?.setVisible(true)
                this.engine.destroyGameObject(this.id)
            }
            
            // skv[0] = clamp(skv[0] + ut, 0.26, 1.0);
            // skv[1] = clamp(skv[1] - ut, 0.18, 0.27);
            // this.engine.setScene('lobby')
        }

        this.rotation.y = Math.atan2( -this.engine.getCamera().getPosition().x - this.position.x, -this.engine.getCamera().getPosition().z - this.position.z ) * ( 180 / Math.PI )
    }

    draw(glEngine: Engine):void { 
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation,
            this.scale,
            this.light,
            this.factor
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
