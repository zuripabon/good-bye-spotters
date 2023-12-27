import Mesh from './Mesh'
import Shader from './Shader'
import Texture from './Texture'
import GameObject from './GameObject'
import Camera from './Camera'
import { on, abab } from './utils'
import ModelView from './ModelView'
import Vector from './Vector'

// A WEBGL program is a combination shader programs which are dynamically controlled with javascript code
abstract class Engine {

  glContext: WebGLRenderingContext
  modelView: ModelView
  
  protected inputs: {[key:string]: boolean} = {}
  protected gameCamera: GameObject = new Camera()
  protected gameState: {[key:string]: number|string|boolean} = {}
  protected lastDelta:number = 0.016
  protected currentScene:string = 'default'
  protected gameScenes:{[key:string]: GameObject[]} = {}
  protected fps:number = 30
  protected interObjectCollisionsEnabled: boolean = false
  
  private canvas: HTMLCanvasElement
  private shader: Shader
  private texture: Texture | null = null
  private gameObjectCollisions:{[key:string]: boolean} = {}
  private shaderUniforms:{texture: number, over: number, sky: number[], factor: number} = {texture: 0, over: 1.0, sky: [0.0, 0.0], factor: 0.0}
  private totalGameTime: number = 0

  constructor(vertexShader: string, fragmentShader: string, texture: HTMLImageElement){
    this.canvas = document.createElement('canvas')

    const glContext = this.canvas.getContext('webgl', {alpha: false})

    if(!glContext){
      throw new Error('could not create context')
    }

    this.glContext = glContext
    this.modelView = new ModelView()
    this.shader = new Shader(this, vertexShader, fragmentShader)

    this.glContext.enable(this.glContext.DEPTH_TEST);
    this.glContext.enable(this.glContext.BLEND) //  - warning: in order to have true alpha you need to discard values on the shader (otherwise you get some not fully transparent ghosts)
    this.glContext.blendFunc(770, 771)
    this.texture = Texture.fromImage(this.glContext, texture);
  }

  createPlayer(camera: GameObject, state: {[key:string]: number|string|boolean} = {} ){
    this.gameCamera = camera
    this.gameState = state
  }  

  createGameObject(gameObject:GameObject, sceneId?: string){
    const useScene = sceneId || this.currentScene

    if(this.gameScenes[useScene]){
      this.gameScenes[useScene].push(gameObject)
      return;
    }
    this.gameScenes[useScene] = [gameObject]
  }  
  
  // Only for current scene
  getGameObjectById(gameObjectId: string):GameObject | undefined {
    return this.gameObjects.find(gameObject => gameObject.getId() === gameObjectId)
  }

  destroyGameObject(gameObjectId: string):void {
    const indexToDelete = this.gameObjects.findIndex(gameObject => gameObject.getId() === gameObjectId)

    if(indexToDelete){
      this.gameObjects.splice(indexToDelete, 1)
    }
  }

  getShadersUniforms() {
    return this.shaderUniforms
  }

  setShadersUniforms(over: number = 1.0, sky: number[] = [0, 0], factor:number = 0.0) {
    this.shaderUniforms = { texture: 0, over, sky, factor }
  }

  getCamera(): GameObject {
    return this.gameCamera
  }

  getScene(): string {
    return this.currentScene
  }

  setScene(sceneId:string){
    if(this.gameScenes[sceneId]) {
      if(this.gameCamera.onSceneLeave){
        this.gameCamera.onSceneLeave(this.currentScene)
      }
      if(this.gameScenes[this.currentScene]){
        for (let i=0; i < this.gameScenes[this.currentScene].length; i++) { 
          const currentGameObject = this.gameScenes[this.currentScene][i]
          if(currentGameObject.onSceneLeave){
            currentGameObject.onSceneLeave(this.currentScene)
          }
        }
      }

      this.currentScene = sceneId

      if(this.gameCamera.onSceneEnter){
        this.gameCamera.onSceneEnter(this.currentScene)
      }
      for (let i=0; i < this.gameScenes[this.currentScene].length; i++) { 
        const currentGameObject = this.gameScenes[this.currentScene][i]
        if(currentGameObject.onSceneEnter){
          currentGameObject.onSceneEnter(this.currentScene)
        }
      }
    }
  }

  getTotalGameTime(){
    return this.totalGameTime
  }

  getLastDelta(){
    return this.lastDelta
  }

  getState(key:string = ''){
    if(key){
      return this.gameState[key]
    }
    return this.gameState
  }

  setState(key:string, value: string | number | boolean):void {
    this.gameState[key] = value
  }

  drawObject(
    geometry:Mesh, 
    position:Vector, 
    rotation:Vector, 
    s:number, 
    over?:number, 
    factor?:number
    ) {
      this.modelView.pushMatrix();
      this.modelView.translate(position.x, position.y, position.z);
      if(s !== 1.0){
        this.modelView.scale(s, s, s);
      }
      if(rotation.x){
        this.modelView.rotate(rotation.x, 1.0, 0.0, 0.0);
      }if(rotation.y){
        this.modelView.rotate(rotation.y, 0.0, 1.0, 0.0);
      }if(rotation.z){
        this.modelView.rotate(rotation.z, 0.0, 0.0, 1.0);
      }
      const shaderUniforms = this.getShadersUniforms()
      this.shader.uniforms({...shaderUniforms, over: over || shaderUniforms.over, factor: factor || shaderUniforms.factor});
      this.shader.draw(geometry);
      this.modelView.popMatrix();
  }
  
  animate() {
    let time = window.performance.now()
    // let frameCount = 0

    const fpsInterval = 1000 / this.fps;
    // const startTime = time

    const loop = (newtime: number) => {

      const now = newtime;
      const elapsed = now-time
      
      if (elapsed > fpsInterval) {
          const delta = elapsed / 1000
          this.totalGameTime += delta
          this.lastDelta = delta
        
          // const currentFps = Math.round(1000 / ((now - startTime) / ++frameCount) * 100) / 100;
          // console.log({currentFps})

          this.gameCamera?.update(delta, this.inputs)

          // this.gameObjects.sort((a:GameObject, b:GameObject) => b.getPosition().z - -a.getPosition().z)

          const gameObjects = this.gameObjects
          
          for (let i=0; i < gameObjects.length; i++) {

            const gameObject = gameObjects[i]
            const gameObjectId = gameObject.getId()

            if(!gameObject.isVisible()){
              continue;
            }

            gameObject?.update(delta, this.inputs)

            this.checkCollisions(gameObjectId, gameObject)
          }
          
          this.render()

          // Get ready for next frame by setting then=now, but...
          // Also, adjust for fpsInterval not being multiple of 16.67
          time = now - (elapsed % fpsInterval)
        }

        window.requestAnimationFrame(loop);
    }

    loop(time);
  }

  fullscreen() {
    document.body.appendChild(this.canvas);
    document.body.style.overflow = 'hidden';

    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0px';
    this.canvas.style.top = '0px';

    this.canvas.addEventListener("click", async () => {
      await this.canvas.requestPointerLock();
    });

    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.glContext.viewport(0, 0, this.canvas.width, this.canvas.height);
      
      this.modelView.setProjectionMode()
      this.modelView.loadIdentity();
      this.modelView.perspective(90 /*45*/, this.canvas.width / this.canvas.height,  0.01,  1000);
      this.modelView.setModelviewMode()
      
      this.render();
    }
    document.addEventListener('keydown', (e:KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) {
        return
      }
      this.inputs[e.code] = true;
    });
    
    document.addEventListener('keyup', (e:KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) {
        return
      }
      this.inputs[e.code] = false;
    });
    this.canvas.addEventListener('mousemove', (e:MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if(this.gameCamera.onMouseMove){
        this.gameCamera?.onMouseMove(e.movementX, e.movementY, this.lastDelta)
      }

      const gameObjects = this.gameObjects

      for (let i=0; i < gameObjects.length; i++) { 

        const gameObject = gameObjects[i]

        if(!gameObject.isVisible()){
          continue;
        }

        if(gameObject.onMouseMove){
          gameObject.onMouseMove(e.movementX, e.movementY, this.lastDelta)
        }
      }

    })
    this.canvas.addEventListener('mousedown', (e:MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if(this.gameCamera.onMouseDown){
        this.gameCamera?.onMouseDown(e.movementX, e.movementY, this.lastDelta)
      }

      const gameObjects = this.gameObjects

      for (let i=0; i < gameObjects.length; i++) { 

        const gameObject = gameObjects[i]

        if(!gameObject.isVisible()){
          continue;
        }

        if(gameObject.onMouseDown){
          gameObject.onMouseDown(e.movementX, e.movementY, this.lastDelta)
        }
      }

    })
    this.canvas.addEventListener('mouseup', (e:MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if(this.gameCamera.onMouseUp){
        this.gameCamera?.onMouseUp(e.movementX, e.movementY, this.lastDelta)
      }

      const gameObjects = this.gameObjects

      for (let i=0; i < gameObjects.length; i++) { 

        const gameObject = gameObjects[i]

        if(!gameObject.isVisible()){
          continue;
        }

        if(gameObject.onMouseUp){
          gameObject.onMouseUp(e.movementX, e.movementY, this.lastDelta)
        }
      }

    })
    on(window, 'resize', resize);
    resize();
  }

  private get gameObjects(){
    return this.gameScenes[this.currentScene]
  }

  private checkCollisions(gameObjectId:string, gameObject:GameObject){

    if(!gameObject.getCollider){
      return
    }

    // Camera collision
    this.checkCollision(gameObjectId, gameObject, 'camera', this.gameCamera)

    
    if(!this.interObjectCollisionsEnabled){
      return;
    }

    // Rest objects collision between all of them, do we really want this? looks too much
    const gameObjects = this.gameObjects
    for (let i=0; i < gameObjects.length; i++) { 

      const currentGameObject = gameObjects[i]
      const currentGameObjectId = currentGameObject.getId()

      if(currentGameObjectId !== gameObjectId){
        this.checkCollision(gameObjectId, gameObject, currentGameObjectId, currentGameObject)
      }

    }
  }  
  
  private checkCollision(
    gameObjectAId:string, 
    gameObjectA:GameObject, 
    gameObjectBId:string, 
    gameObjectB:GameObject
  ){
    
    if(!gameObjectA.getCollider || !gameObjectB.getCollider) {
      return
    }
      
    const gameObjectABorderBox = gameObjectA.getCollider()
    const gameObjectBBorderBox = gameObjectB.getCollider()
    const isColliding = abab(gameObjectABorderBox, gameObjectBBorderBox)
    const abId = `${gameObjectAId}${gameObjectBId}`
    const baId = `${gameObjectBId}${gameObjectAId}`
    
    if(isColliding){
      if(!this.gameObjectCollisions[abId] && gameObjectA.onCollideEnter){
        gameObjectA.onCollideEnter(gameObjectBId, this.currentScene)
        this.gameObjectCollisions[abId] = true
      } 

      if(!this.gameObjectCollisions[baId] && gameObjectB.onCollideEnter){
        gameObjectB.onCollideEnter(gameObjectAId, this.currentScene)
        this.gameObjectCollisions[baId] = true
      }

      return;
    }

    if(this.gameObjectCollisions[abId] && gameObjectA.onCollideLeave){
      gameObjectA.onCollideLeave(gameObjectBId, this.currentScene)
      this.gameObjectCollisions[abId] = false
    }
    
    if(this.gameObjectCollisions[baId] && gameObjectB.onCollideLeave){
      gameObjectB.onCollideLeave(gameObjectAId, this.currentScene)
      this.gameObjectCollisions[baId] = false
    }
    
  }

  private render(){
    if(!this.texture){
      return
    }

    this.modelView.loadIdentity()

    this.glContext.clearColor(this.getShadersUniforms().sky[0], 0.0, this.getShadersUniforms().sky[1], 1.0)
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT)

    this.gameCamera?.draw(this)

    const gameObjects = this.gameObjects

    for (let i=0; i < gameObjects.length; i++) { 
      const gameObject = gameObjects[i]

      if(!gameObject.isVisible()){
        continue;
      }

      gameObject.draw(this)
    }

  }

}

export default Engine
// const ENUM = 0x12340000;
// const MODELVIEW = ENUM | 1;
// const PROJECTION = ENUM | 2;

// export default class GL {

//   private glContext: RenderingContext;
  
//   private modelviewMatrix = new Matrix([]);
//   private projectionMatrix = new Matrix([]);

//   private constructor(canvas:HTMLCanvasElement,  options: { alpha?: unknown; }){

//     let glContext = null;

//     try { glContext = canvas.getContext('webgl', options); } catch (e) {console.error(e)}
//     try { glContext = glContext || canvas.getContext('experimental-webgl', options); } catch (e) {console.error(e)}
//     if (!glContext) throw new Error('WebGL not supported');
//     //gl.HALF_FLOAT_OES = 0x8D61; // ???

//     this.glContext = glContext;

//     this.addMatrixStack();
//     //addImmediateMode(); // BRING THIS BACK IF NEEDED
//     this.addEventListeners();
//     this.addOtherMethods();
//   }

//   private setMatrixMode(mode) {
//     switch (mode) {
//       case this.MODELVIEW:
//         matrix = 'modelviewMatrix';
//         stack = modelviewStack;
//         break;
//       case this.PROJECTION:
//         matrix = 'projectionMatrix';
//         stack = projectionStack;
//         break;
//       default:
//         throw new Error('invalid matrix mode ' + mode);
//     }
//   };

//   gl.loadIdentity = function() {
//     Matrix.identity(gl[matrix]);
//   };
//   gl.loadMatrix = function(m) {
//     const from = m.m, to = gl[matrix].m;
//     for (let i = 0; i < 16; i++) {
//       to[i] = from[i];
//     }
//   };
//   gl.multMatrix = function(m) {
//     gl.loadMatrix(Matrix.multiply(gl[matrix], m, resultMatrix));
//   };
//   gl.perspective = function(fov, aspect, near, far) {
//     gl.multMatrix(Matrix.perspective(fov, aspect, near, far, tempMatrix));
//   };

//   gl.scale = function(x, y, z) {
//     gl.multMatrix(Matrix.scale(x, y, z, tempMatrix));
//   };
//   gl.translate = function(x, y, z) {
//     gl.multMatrix(Matrix.translate(x, y, z, tempMatrix));
//   };
//   gl.rotate = function(a, x, y, z) {
//     gl.multMatrix(Matrix.rotate(a, x, y, z, tempMatrix));
//   };


//   gl.pushMatrix = function() {
//     stack.push(Array.prototype.slice.call(gl[matrix].m));
//   };
//   gl.popMatrix = function() {
//     const m = stack.pop();
//     gl[matrix].m = /*hasFloat32Array ?*/ new Float32Array(m); // : m;
//   };



//   private addMatrixStack() {

//   const tempMatrix = new Matrix();
//   const resultMatrix = new Matrix();
//   const modelviewStack = [];
//   const projectionStack = [];
//   let matrix, stack;
  

//   gl.matrixMode(gl.MODELVIEW); // perhaps shorten this up?
// }

//   static create(options: { alpha?: unknown; }) {

//     options = options || {};
//     if(!('alpha' in options)) options.alpha = false;

//     const canvas = document.createElement('canvas');
//     canvas.width = 800;  // wtf
//     canvas.height = 600;
//     // mouse capture. todo: make sure when we are in fullscreen mode and when we aren't...
//     canvas.addEventListener("click", async () => {
//         await canvas.requestPointerLock();
//     });

//     return new Engine(canvas, options);
//   }
// }

// interface WebGLRenderingContextWithStack extends WebGLRenderingContext {
//   modelviewMatrix: Matrix;
//   projectionMatrix: Matrix;
//   matrixMode(mode: number): void;
//   loadIdentity(): void;
//   loadMatrix(m: Matrix): void;
//   multMatrix(m: Matrix): void;
//   perspective(fov: number, aspect: number, near: number, far: number): void;
//   scale(x: number, y: number, z: number): void;
//   translate(x: number, y: number, z: number): void;
//   rotate(a: number, x: number, y: number, z: number): void;
//   pushMatrix(): void;
//   popMatrix(): void;
// }

// const ENUM = 0x12340000; // Add the missing ENUM variable
// const MODELVIEW = ENUM | 1;
// const PROJECTION = ENUM | 2;
// const hasFloat32Array = true; // Assuming Float32Array is available

// let gl: WebGLRenderingContextWithStack;

// export default {
//   create: function (options: WebGLContextAttributes): WebGLRenderingContextWithStack {
//     options = options || {};
//     const canvas = document.createElement('canvas');
//     canvas.width = 800;
//     canvas.height = 600;
//     if (!('alpha' in options)) options.alpha = false;
//     try {
//       gl = canvas.getContext('webgl', options) as WebGLRenderingContextWithStack;
//     } catch (e) {
//       console.log(e)
//     }
//     try {
//       gl = gl || (canvas.getContext('experimental-webgl', options) as WebGLRenderingContextWithStack);
//     } catch (e) {
//       console.log(e)
//     }
//     if (!gl) throw new Error('WebGL not supported');

//     canvas.addEventListener('click', async () => {
//       await canvas.requestPointerLock();
//     });

//     addMatrixStack();
//     // addEventListeners();
//     // addOtherMethods();
//     return gl;
//   },

//   keys: {},

//   Matrix: Matrix,
//   Buffer: Buffer,
//   Mesh: Mesh,
//   Shader: Shader,
//   Texture: Texture,
//   Vector: Vector,
// };

// function addMatrixStack() {
  
//   const tempMatrix = new Matrix();
//   const resultMatrix = new Matrix();
//   gl.modelviewMatrix = new Matrix();
//   gl.projectionMatrix = new Matrix();
//   const modelviewStack: number[][] = [];
//   const projectionStack: number[][] = [];
//   let matrix: keyof WebGLRenderingContextWithStack, stack: number[][];
//   gl.matrixMode = function (mode: number) {
//     switch (mode) {
//       case MODELVIEW:
//         matrix = 'modelviewMatrix';
//         stack = modelviewStack;
//         break;
//       case PROJECTION:
//         matrix = 'projectionMatrix';
//         stack = projectionStack;
//         break;
//       default:
//         throw new Error('invalid matrix mode ' + mode);
//     }
//   };
//   gl.loadIdentity = function () {
//     Matrix.identity(gl[matrix]);
//   };
//   gl.loadMatrix = function (m: Matrix) {
//     const from = m.m,
//       to = gl[matrix].m;
//     for (let i = 0; i < 16; i++) {
//       to[i] = from[i];
//     }
//   };
//   gl.multMatrix = function (m: Matrix) {
//     gl.loadMatrix(Matrix.multiply(gl[matrix], m, resultMatrix));
//   };
//   gl.perspective = function (fov: number, aspect: number, near: number, far: number) {
//     gl.multMatrix(Matrix.perspective(fov, aspect, near, far, tempMatrix));
//   };

//   gl.scale = function (x: number, y: number, z: number) {
//     gl.multMatrix(Matrix.scale(x, y, z, tempMatrix));
//   };
//   gl.translate = function (x: number, y: number, z: number) {
//     gl.multMatrix(Matrix.translate(x, y, z, tempMatrix));
//   };
//   gl.rotate = function (a: number, x: number, y: number, z: number) {
//     gl.multMatrix(Matrix.rotate(a, x, y, z, tempMatrix));
//   };

//   gl.pushMatrix = function () {
//     stack.push(Array.prototype.slice.call(gl[matrix].m));
//   };
//   gl.popMatrix = function () {
//     const m = stack.pop()!;
//     gl[matrix].m = hasFloat32Array ? new Float32Array(m) : m;
//   };

//   gl.matrixMode(MODELVIEW);
// }

