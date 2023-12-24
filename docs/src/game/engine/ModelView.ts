import Matrix from './Matrix'

class ModelView {

  private modelviewMatrix: Matrix
  private projectionMatrix: Matrix
  private modelviewStack:Float32Array[] = [];
  private projectionStack:Float32Array[] = [];
  private tempMatrix: Matrix
  private resultMatrix: Matrix
  private matrixMode:string = 'projection'

  constructor(){
    this.modelviewMatrix = new Matrix()
    this.projectionMatrix = new Matrix()
    this.tempMatrix = new Matrix()
    this.resultMatrix = new Matrix()
  }

  setProjectionMode(){
    this.matrixMode = 'projection'
  }
  
  setModelviewMode(){
    this.matrixMode = 'modelView'
  }
  
  getProjectionMatrix():Matrix {
    return this.projectionMatrix
  }
  
  getModelviewMatrix():Matrix {
    return this.modelviewMatrix
  }
  
  loadIdentity() {
    Matrix.identity(this.matrix);
  }

  multMatrix(m:Matrix) {
    this.loadMatrix(Matrix.multiply(this.matrix, m, this.resultMatrix));
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

  pushMatrix(){
    this.stack.push(Float32Array.from(this.matrix.m));
  }
  
  popMatrix(){
    const m = this.stack.pop();
    if(!m){return;}
    this.matrix.m = new Float32Array(m);
  }

  rotate(a:number, x:number, y:number, z:number) {
    this.multMatrix(Matrix.rotate(a, x, y, z, this.tempMatrix));
  }

  private get matrix():Matrix {
    if(this.matrixMode === 'modelView'){
      return this.modelviewMatrix
    }

    return this.projectionMatrix
  }  
  
  private get stack():Float32Array[] {
    if(this.matrixMode === 'modelView'){
      return this.modelviewStack
    }

    return this.projectionStack
  }

  private loadMatrix(m:Matrix) {
    const from = m.m
    const to = this.matrix.m;
    for (let i = 0; i < 16; i++) {
      to[i] = from[i];
    }
  }
}

export default ModelView
