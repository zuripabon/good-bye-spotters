import Engine from './engine'
import Mesh from './engine/Mesh'
import { VertexShader, FragmentShader } from './shader'
import Camera from './camera'

class Game extends Engine {

    private gameState: {[key:string]: number|string|boolean}

    private constructor(){
        super(VertexShader, FragmentShader)
        this.gameState = {
            angleY: 0
        }
    }

    initWorld(texture: HTMLImageElement){
        this.createTexture(texture)
        this.createGameObject('church', Mesh.box(this.glContext, 0, "LRGCFB"))
        this.createGameObject('priest', Mesh.plane(this.glContext, 512, 0, 640, 254, 0.13, 0.30))
        this.createCamera(Camera.create(0.0, -0.45, -1.0))
    }

    update(delta: number, inputs: {[key:string]: boolean} = {}){
        this.camera?.update(delta, inputs)
    }

    draw(){
        this.drawChurch() 
    }

    drawChurch(){
        this.drawObject('church', 0, 0, 0, 1.0)
        this.drawObject('priest', 0, 0.3, 0, 1.0)
    }

    static run(texture: HTMLImageElement){
        const game = new Game()
        game.initWorld(texture)
        game.fullscreen()
        game.animate()
    }
}

export default Game
