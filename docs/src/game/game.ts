import Engine from './engine'
import { VertexShader, FragmentShader } from './shader'
import Player from './player'
import Church from './church'
import Priest from './priest'

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
        this.createGameObject('player', new Player())
        this.createGameObject('church', new Church(this))
        this.createGameObject('priest', new Priest(this))
    }

    static run(texture: HTMLImageElement){
        const game = new Game()
        game.initWorld(texture)
        game.fullscreen()
        game.animate()

        console.log(`Running at fixed ${game.fps} FPS`)
    }
}

export default Game
