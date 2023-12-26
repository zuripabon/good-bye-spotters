import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"
import { clamp } from "../engine/utils"

class Shotgun implements GameObject {

    private id:string 
    private position: Vector = new Vector(0.1, -0.15, -0.135)
    private rotation: Vector = new Vector(0, 0, 0)
    private dimension: Vector = new Vector(0 , 0, 0)
    private scale: number = 0.05
    private light: number = 1
    private visible: boolean = false
    private animationSpeed: number = 3
    private geometry: Mesh
    private engine: Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'shotgun'
        this.geometry = Mesh.box(glEngine.glContext, 2, "LC")
        this.engine = glEngine
    }

    getId():string {
        return this.id
    }

    setScale(scale: number){
        this.scale = scale
    }

    isVisible(): boolean {
        return this.visible
    }
    
    setVisible(visible: boolean): void {
        this.visible = visible
    }

    getPosition(): Vector {
        return this.position
    }

    setPosition(x:number, y:number, z:number): void {
        this.position.x = x || this.position.x
        this.position.y = y || this.position.y
        this.position.z = z || this.position.z
    }

    getRotation(): Vector {
        return this.rotation
    }

    setRotation(x:number|null, y:number|null, z:number|null): void {
        this.rotation.x = x !== null ? x : this.rotation.x
        this.rotation.y = y !== null ? y : this.rotation.y
        this.rotation.z = z !== null ? z : this.rotation.z
    }

    update(delta: number){
        // animate the shotgun moving back to position
        this.position.x += (Math.sin(this.engine.getTotalGameTime() * this.animationSpeed) * 0.00010);
        this.position.y += (Math.sin(this.engine.getTotalGameTime() * this.animationSpeed) * 0.00010);
        this.position.z = clamp(this.position.z - delta * 0.25, -0.15, -0.12);
    }

    draw(glEngine: Engine):void {
        glEngine.modelView.pushMatrix()
        glEngine.modelView.loadIdentity()
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation,
            this.scale,
            this.light
        )
        glEngine.modelView.popMatrix()
    }

    onMouseDown(){
        this.light = 1.3;
        this.position.z = -0.11;
    }
    
    onMouseUp(){
        
        const camera = this.engine.getCamera()
        const bullet = this.engine.getGameObjectById('bullet')
        bullet?.setPosition(-camera.getPosition().x, null, -camera.getPosition().z)
        
        this.engine.setState({ 
            cameraRotationY : camera.getRotation().y * 3.14 / 180.0
        })
        
        bullet?.setVisible(true)
        
        this.light = 1;
    }

    getCollider():[Vector, Vector] {
        const minBorderBox = this.position.subtract(this.dimension);
        const maxBorderBox = this.position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }
}

export default Shotgun
