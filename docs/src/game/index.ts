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
import { rn } from './engine/utils'

class Game extends Engine {

    private constructor(gameTexture: HTMLImageElement){
        super(VertexShader, FragmentShader, gameTexture)
        this.init()
    }

    private init(){
        this.createPlayer(new Player(this), {})

        this.setLobbyScene()
        this.setWorldScene()

        this.setScene('lobby')
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

    //     var j = 0;
    //     for(i = u.length-1; i >=0 ; i--)
    //     {

    //         this.createGameObject(new Npc(this), 'world')
    //         // var alt = u.splice(Math.floor(Math.random()*u.length), 1);
    //         var ww = msg[j];
    //         var r = mo(u[i], 0 /*TYPE_NPC*/, rn(0, 0.5), 0.3, -(rn(1, 4)*3) - rn(0.0, 0.5),  0.015, 0.30, 0.05, ww[0], ww[1], ww[2], ww[3]);
    //         r.over = 2.0;

    //         j+=1;
    //     }
    //     ow = function()
    // {
    //     var i = 0,
    //         u = [1,5,7,3,6,4], // npcs
    //         g = mo(16  /*MESH_GROUND*/, 2 /*TYPE_SPRITE*/,  0, 0,     0,    0,   0,   0);       // ground
    //         mn = mo(15 /*MESH_MOON*/,   2 /*TYPE_SPRITE*/,  0, 2.0,  -50.0, 0.5, 0.5, 0.5);     // moon
    //         ctl = mo(9 /*MESH_CASTLE*/, 2 /*TYPE_SPRITE*/,  0, 0.75, -40.0, 0.5, 0.5, 0.5);     // castle

    //     g.s = 100.0;
    //     mn.s = 2.0;
    //     ctl.s = 1.5;

    //     // TREES
    //     let mud = 12;
    //     for(i = 0; i < 50; i++)
    //     {

    //         mo(mud, 3 /*TYPE_SPRITE_BDB*/, rn(-3.0, -0.5), 0.6, -(i * 0.3), 0.015, 0.5, 0.015); // small or "big" trees
    //         mo(mud, 3 /*TYPE_SPRITE_BDB*/, rn(0.5, 3.0), 0.6,   -(i * 0.3), 0.015, 0.5, 0.015);

    //         // mo(mud, 3 /*TYPE_SPRITE_BDB*/, rn(-6.0, -4.0), 0.6, 4.0 -(i * 0.3), 0.015, 0.5, 0.015); // trees that are on the sides of the road
    //         // mo(mud, 3 /*TYPE_SPRITE_BDB*/, rn( 4.0,  6.0), 0.6, 4.0 -(i * 0.3), 0.015, 0.5, 0.015);

    //         mo(13 /*MESH_BUSH*/,  2 /*TYPE_SPRITE*/,  rn(-3.0, -0.25), 0.1, 2.0 -(i * 0.3),  0.05, 0.2, 0.05); // bushes
    //         mo(13 /*MESH_BUSH*/,  2 /*TYPE_SPRITE*/,  rn(0.25, 3.0),   0.1, 2.0 -(i * 0.3),  0.0, 0.0, 0.0);
    //     }

    //     // NPCS !!!
    //     var j = 0;
    //     for(i = u.length-1; i >=0 ; i--)
    //     {
    //         // var alt = u.splice(Math.floor(Math.random()*u.length), 1);
    //         var ww = msg[j];
    //         var r = mo(u[i], 0 /*TYPE_NPC*/, rn(0, 0.5), 0.3, -(rn(1, 4)*3) - rn(0.0, 0.5),  0.015, 0.30, 0.05, ww[0], ww[1], ww[2], ww[3]);
    //         r.over = 2.0;

    //         j+=1;
    //     }
    // };
    //     this.createGameObject(new Church(this), 'world')
    }

    static run(gameTexture: HTMLImageElement){
        const game = new Game(gameTexture)
        game.fullscreen()
        game.animate()

        console.log(`Running at fixed ${game.fps} FPS`)
    }
}

export default Game
