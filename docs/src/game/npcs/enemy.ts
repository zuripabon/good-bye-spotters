import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import { rn } from "../engine/utils"

class Enemy implements GameObject {

    private id:string 
    private position:Vector = new Vector(0, 0.3, 0)
    private rotation: Vector = new Vector(0, 0, 0)
    private dimension:Vector = new Vector(0.015, 0.30, 0.05)
    private scale: number = 1.0 
    private light: number = 1.0
    private factor: number = 0
    private visible: boolean = true
    private timeToRespawn: number = 0
    private geometry: Mesh
    private engine:Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || `enemy${(new Date()).getTime()}`
        this.engine = glEngine
        this.geometry = Mesh.plane(glEngine.glContext, 32*8, 0, 47*8, 31*8, 0.13, 0.30)
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

    update(){

        this.position.x += rn(-4.0, 4.0); // re-spawn the poor thing between our path limits
        this.position.z += rn(-5.0, 5.0); // this is kinda shitty but gives interesting results - sometimes spawns a demon right behind you and it's funny

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
    }

}

export default Enemy
