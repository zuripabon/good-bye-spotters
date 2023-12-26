import Engine from './engine'
import { VertexShader, FragmentShader } from './shader'
import Player from './player'
import Church from './nature/church'
import Priest from './npcs/priest'
import Ground from './nature/ground'
import Moon from './nature/moon'
import Tree from './nature/tree'
import TreeBush from './nature/treeBush'
import Skybox from './nature/skybox'
import { enumKeys, rn } from './engine/utils'
import Npc, { NpcTypes } from './npcs/npc'
import Shotgun from './npcs/shotgun'
import Bullet from './npcs/bullet'

class Game extends Engine {

    private constructor(gameTexture: HTMLImageElement){
        super(VertexShader, FragmentShader, gameTexture)
        this.init()
    }

    private init(){
        this.createPlayer(new Player(this))

        this.setLobbyScene()
        this.setWorldScene()

        this.setScene('world')
    } 
    
    private setLobbyScene(){
        this.createGameObject(new Church(this), 'lobby')
        this.createGameObject(new Priest(this), 'lobby')
    } 
    
    private setWorldScene(){
        this.createGameObject(new Skybox(this), 'world')
        this.createGameObject(new Ground(this), 'world')
        this.createGameObject(new Moon(this), 'world')
        

        for(let i = 0; i < 30; i++) {
            
            const treeA = new Tree(this, `tree-${i}-left`)
            treeA.setPosition(rn(-3.0, -0.5), 0.6, -(i * 0.3))

            const treeB = new Tree(this, `tree-${i}-right`)
            treeB.setPosition(rn(0.5, 3.0), 0.6, -(i * 0.3))
            
            const treeBushA = new TreeBush(this, `bush-${i}-left`)
            treeBushA.setPosition(rn(-3.0, -0.25), 0.1, 2.0 -(i * 0.3))
            
            const treeBushB = new TreeBush(this, `bush-${i}-right`)
            treeBushB.setPosition(rn(0.25, 3.0),   0.1, 2.0 -(i * 0.3))
            
            this.createGameObject(treeA, 'world')
            this.createGameObject(treeB, 'world')
            this.createGameObject(treeBushA, 'world')
            this.createGameObject(treeBushB, 'world')
        }

        for (const npcId of enumKeys(NpcTypes)) {

            const npc = new Npc(this, NpcTypes[npcId]);
            npc.setPosition(rn(0, 0.5), 0.3, -rn(1, 4) - rn(0.0, 0.3))
            npc.setLight(1.0)

            this.createGameObject(npc, 'world')
        }

        this.createGameObject(new Shotgun(this), 'world')
        this.createGameObject(new Bullet(this), 'world')
    }

    static run(gameTexture: HTMLImageElement){
        const game = new Game(gameTexture)
        game.fullscreen()
        game.animate()

        console.log(`Running at fixed ${game.fps} FPS`)
    }
}

export default Game
