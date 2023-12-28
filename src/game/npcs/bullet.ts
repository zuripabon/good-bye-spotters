import Vector from "../engine/Vector"
import Mesh from "../engine/Mesh"
import Engine from "../engine"
import GameObject from "../engine/GameObject"

class Bullet implements GameObject {

    private id:string 
    private position: Vector = new Vector(100000, 0.3, 100000)
    private rotation: Vector = new Vector(0, 0, 0)
    private dimension: Vector = new Vector(0.25,  0.25,  0.25)
    private scale: number = 1
    private visible: boolean = false
    private geometry: Mesh
    private engine: Engine

    constructor(glEngine: Engine, id?: string){
        this.id = id || 'bullet'
        this.geometry = Mesh.plane(glEngine.glContext, 0, 80*8, 15*8, 95*8, 0.22, 0.22)
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

    getCollider():[Vector, Vector] {
        const minBorderBox = this.position.subtract(this.dimension);
        const maxBorderBox = this.position.add(this.dimension); 
        return [minBorderBox, maxBorderBox]
    }

    update(delta: number){

        const cameraRotationY = (this.engine.getState('cameraRotationY') || 0 ) as number

        this.position.x += Math.sin(cameraRotationY) * delta * 10.0;// * 0.1;
        this.position.z -= Math.cos(cameraRotationY) * delta * 10.0;// * 0.1;
        
        const camera = this.engine.getCamera()
        this.rotation.y = Math.atan2( 
            -camera.getPosition().x - this.position.x, 
            -camera.getPosition().z - this.position.z 
            ) * ( 180 / Math.PI )

    }

    draw(glEngine: Engine):void {
        glEngine.drawObject(
            this.geometry, 
            this.position,
            this.rotation,
            this.scale
        )
    }
}

export default Bullet
