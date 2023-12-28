/* eslint-disable no-sparse-arrays */
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
import GameOverNpm from './npcs/gameoverNpc'

class Game extends Engine {

    private constructor(gameTexture: HTMLImageElement){
        super(VertexShader, FragmentShader, gameTexture)
        this.init()
    }

    private init(){
        this.createPlayer(new Player(this))

        this.createLobbyScene()
        this.createWorldScene()
        this.createGameOverScene()

        this.setAudio()

        this.setScene('lobby')
    } 
    
    private createLobbyScene(){
        this.createGameObject(new Church(this), 'lobby')
        this.createGameObject(new Priest(this), 'lobby')
    } 
    
    private createWorldScene(){
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
            this.createGameObject(npc, 'world')
        }

        this.createGameObject(new Shotgun(this), 'world')
        this.createGameObject(new Bullet(this), 'world')
    }

    private createGameOverScene(){
        this.createGameObject(new Church(this), 'gameover')
        this.createGameObject(new GameOverNpm(this), 'gameover')
    } 

    private setAudio(){

        this.sound.loadSample('steps', [2,0.2,100,.01,.02,.02,,1.9,-7.4,,,,.07,1.5,,,.1,,.08,.47])
        this.sound.loadSample('shotgun', [,,471,,.09,.47,4,1.06,-6.7,,,,,.9,61,.1,,.82,.09,.13])
        this.sound.loadSample('enterAttackMode', [,,662,.82,.11,.33,1,0,,-0.2,,,,1.2,,.26,.01])
        this.sound.loadSample('challengeAccepted', [1.27,,5555,.01,.08,.08,4,2.57,,.1,-50,.02,.01,2,-1,,,.37,.08,.01])
        this.sound.loadSample('hit', [,,528,.01,,.48,,.6,-11.6,,,,.32,4.2])
        this.sound.loadSample('drum', [2,.8,999,,,,,1.5,,.3,-99,.1,1.63,,,.11,.22])
    }

    static run(gameTexture: HTMLImageElement){
        const game = new Game(gameTexture)
        game.fullscreen()
        game.animate()

        console.log(`Running at fixed ${game.fps} FPS`)
    }
}

export default Game
