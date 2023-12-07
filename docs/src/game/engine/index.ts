import Matrix from './Matrix'
import Mesh from './Mesh'
import Shader from './Shader'
import Texture from './Texture'
import GameObject from './GameObject'
import { on, abab } from './utils'

// A WEBGL program is a combination shader programs which are dynamically controlled with javascript code
abstract class Engine {

  private canvas: HTMLCanvasElement
  private shader: Shader
  private texture: Texture | null = null
  glContext: WebGLRenderingContext
  protected inputs: {[key:string]: boolean} = {}
  private gameObjectCollisions:{[key:string]: boolean} = {}
  protected gameObjects:{[key:string]: GameObject} = {}
  protected gameObjectsIds:string[] = []
  protected lastDelta:number = 0.016

  private tempMatrix: Matrix
  modelviewMatrix: Matrix
  projectionMatrix: Matrix
  private resultMatrix: Matrix
  private stack:Float32Array[] = []
  private matrixMode:string = ''

  constructor(vertexShader: string, fragmentShader: string){
    this.canvas = document.createElement('canvas')

    const glContext = this.canvas.getContext('webgl', {alpha: false})

    if(!glContext){
      throw new Error('could not create context')
    }

    this.tempMatrix = new Matrix()
    this.modelviewMatrix = new Matrix()
    this.projectionMatrix = new Matrix()
    this.resultMatrix = new Matrix()

    this.glContext = glContext
    this.shader = new Shader(this, vertexShader, fragmentShader)

    this.glContext.enable(this.glContext.DEPTH_TEST);
    this.glContext.enable(this.glContext.BLEND) //  - warning: in order to have true alpha you need to discard values on the shader (otherwise you get some not fully transparent ghosts)
    this.glContext.blendFunc(770, 771)
  }

  private render(){
    if(!this.texture){
      return
    }
    this.loadIdentity()
    this.texture.bind(0)

    for(const gameObjectId of this.gameObjectsIds){ 
      this.gameObjects[gameObjectId].draw(this)
    }

  }

  createTexture(texture: HTMLImageElement){
    this.texture = Texture.fromImage(this.glContext, texture);
  }

  createGameObject(gameObjectId:string, gameObject:GameObject){
    this.gameObjectsIds.push(gameObjectId)
    this.gameObjects[gameObjectId] = gameObject
  }

  drawObject(geometry:Mesh, x:number, y:number, z:number, s:number){
      this.pushMatrix();
      this.translate(x, y, z);
      this.scale(s, s, s);
      this.shader.uniforms({ texture: 0,  over: 1.0 });
      this.shader.draw(geometry);
      this.popMatrix();
  }

  private getMatrix():Matrix {
    if(this.matrixMode === 'modelView'){
      return this.modelviewMatrix
    }

    return this.projectionMatrix
  }

  loadIdentity() {
    Matrix.identity(this.getMatrix());
  }

  loadMatrix(m:Matrix) {
    const from = m.m
    const to = this.getMatrix().m;
    for (let i = 0; i < 16; i++) {
      to[i] = from[i];
    }
  }

  multMatrix(m:Matrix) {
    this.loadMatrix(Matrix.multiply(this.getMatrix(), m, this.resultMatrix));
  }

  pushMatrix(){
    this.stack.push(this.getMatrix().m);
  }

  translate(x:number, y:number, z:number){
    this.multMatrix(Matrix.translate(x, y, z, this.tempMatrix));
  }

  scale(x:number, y:number, z:number){
    this.multMatrix(Matrix.scale(x, y, z, this.tempMatrix));
  }

  perspective(fov:number, aspect:number, near:number, far:number) {
    this.multMatrix(Matrix.perspective(fov, aspect, near, far, this.tempMatrix));
  }
  
  popMatrix(){
    const m = this.stack.pop();
    if(!m){return;}
    this.getMatrix().m = /*hasFloat32Array ?*/ m;
  }

  rotate(a:number, x:number, y:number, z:number) {
    this.multMatrix(Matrix.rotate(a, x, y, z, this.tempMatrix));
  }

  animate() {
    let time = new Date().getTime();
    
    const loop = () => {
      const now = new Date().getTime();
      const delta = (now - time) / 1000
      this.lastDelta = delta
      

      for (let i=0; i < this.gameObjectsIds.length; i++) { 

        const gameObjectId = this.gameObjectsIds[i]
        const gameObject = this.gameObjects[gameObjectId]

        gameObject?.update(delta, this.inputs)

        if(gameObjectId !== 'player' && gameObject.onCollide && gameObject.getCollider) {
          const playerBorderBox = this.gameObjects['player'].getCollider()
          const gameObjectBorderBox = gameObject.getCollider()
          const isColliding = abab(gameObjectBorderBox, playerBorderBox)
          if(isColliding){
            if(!this.gameObjectCollisions[gameObjectId]){
              this.gameObjects['player'].onCollide(gameObjectId)
              gameObject.onCollide('player')
              this.gameObjectCollisions[gameObjectId] = true
            } 
          }
          else{
            this.gameObjectCollisions[gameObjectId] = false
          }
        }
      }
      
      this.render();

      window.requestAnimationFrame(loop);
      time = now;
    }

    loop();
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
      
      this.matrixMode = 'projection';
      this.loadIdentity();
      this.perspective(90 /*45*/, this.canvas.width / this.canvas.height,  0.01,  1000);
      this.matrixMode = 'modelView';
      
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
      for(const gameObjectId of this.gameObjectsIds){ 
        const gameObject = this.gameObjects[gameObjectId]
        if(gameObject.onMouseMove){
          gameObject.onMouseMove(e.movementX, e.movementY, this.lastDelta)
        }
      }

    })
    on(window, 'resize', resize);
    resize();
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

