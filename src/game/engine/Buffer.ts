// ### new GL.Buffer(target, type)
//
// Provides a simple method of uploading data to a GPU buffer. Example usage:
//
//     var vertices = new GL.Buffer(gl.ARRAY_BUFFER, Float32Array);
//     var indices = new GL.Buffer(gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
//     vertices.data = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]];
//     indices.data = [[0, 1, 2], [2, 1, 3]];
//     vertices.compile();
//     indices.compile();
//

class Buffer<T extends Float32Array | Uint16Array> {

  private gl: WebGLRenderingContext
  public buffer: WebGLBuffer | null = null
  private type: new (data: ArrayLike<number>) => T;
  private target:number
  public data: number[][]
  public name:string = ''
  public spacing:number = 0;
  public length:number = 0;
  
  constructor(gl: WebGLRenderingContext, target:number, type: new (data: ArrayLike<number>) => T) {
    this.gl = gl
    this.buffer = null;
    this.target = target;
    this.type = type;
    this.data = [];
  }

  compile(type?: number) {
    let data: number[] = [];
    for (let i = 0, chunk = 10000; i < this.data.length; i += chunk) {
      data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk));
    }
    const spacing = this.data.length ? data.length / this.data.length : 0;

    // const data: number[] = this.data.flat()
    // const spacing = this.data.length ? data.length / this.data.length : 0;
    if (spacing != Math.round(spacing)) throw new Error('buffer elements not of consistent size, average size is ' + spacing);
    this.buffer = this.buffer || this.gl.createBuffer();
    this.length = data.length;
    this.spacing = spacing;
    this.gl.bindBuffer(this.target, this.buffer);
    this.gl.bufferData(this.target, new this.type(data), type || this.gl.STATIC_DRAW);
  }
}

export default Buffer;
