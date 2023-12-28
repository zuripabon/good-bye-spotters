import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import {  clamp, rn } from "../engine/utils"

const MAX_ENEMIES_ALLOWED = 50
export let enemiesCounter = 0;

class Enemy implements GameObject {

    private id:string 
    private position:Vector = new Vector(0, 0.3, 0)
    private rotation: Vector = new Vector(0, 0, 0)
    private dimension:Vector = new Vector(0.015, 0.30, 0.05)
    private scale: number = 1.0 
    private light: number = 1.0
    private factor: number = 0
    private visible: boolean = true
    private speed: number = 0.5
    private geometry: Mesh
    private engine:Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || `enemy${++enemiesCounter}`
        this.engine = glEngine
        this.geometry = Mesh.plane(glEngine.glContext, 0, 31*8,  15*8,  31*17, 0.13, 0.30)
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

    update(delta: number){

        this.rotation.y = Math.atan2( -this.engine.getCamera().getPosition().x - this.position.x, -this.engine.getCamera().getPosition().z - this.position.z ) * ( 180 / Math.PI );

        const sp = delta * this.speed;
        const cameraPosition = this.engine.getCamera().getPosition()

        if(Math.abs(cameraPosition.z + this.position.z) < 1.0)
        {
            if(-cameraPosition.x > this.position.x) {
                this.position.x += sp;
            }
            else {
                this.position.x -= sp;
            }
        }

        if(-cameraPosition.z > this.position.z){
            this.position.z += sp;
        }
        else {
            this.position.z -= sp;
        }

        
        const bullet = this.engine.getGameObjectById('bullet')
        if(bullet){
            this.engine.checkCollision(this.id, this, 'bullet', bullet)
        }

        if(this.engine.getState('enemyMode') === true){
            this.engine.sound.playAt('drum', 115)
        }

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

    respawnEnemy() {

        this.visible = false

        const bullet = this.engine.getGameObjectById('bullet')
        bullet?.setPosition(10000, null, 10000)

        const currentKills = this.engine.getState('kills') as number
        this.engine.setState('kills', currentKills + 1)

        // enemy killed, we simply respawn it anywhere else and create a new one
        // so the more enemies killed the more will appear and the speed is increased
        this.engine.cleanCollision(this.id, 'bullet')

        this.position.x = rn(-1, 1) 
        this.position.z = rn(-5.0, 5.0)
        this.speed = clamp(this.speed + rn(-0.3, 0.3), 0.3, 0.5)

        const random = rn(1,100)

        if(random > 70 && enemiesCounter < MAX_ENEMIES_ALLOWED){
            const enemy = new Enemy(this.engine)
            enemy.setPosition(rn(0, 0.5), 0.3, -this.engine.getCamera().getPosition().z + rn(-5.0, 5.0))
            this.engine.createGameObject(enemy, 'world')
        }

        this.visible = true
    }

    gameOver(){
        this.engine.sound.play('hit')
        this.engine.setState('enemyMode', false)
        this.engine.setScene('gameover')
    }

    onCollideEnter(gameObjectId: string): void {

        if(gameObjectId === 'bullet'){
            return this.respawnEnemy()
        }

        if(gameObjectId === 'camera'){
            return this.gameOver()
        }
        
    }

}

export default Enemy
