import Buffer from './Buffer'

interface MeshOptions {
    coords?: boolean;
    normals?: boolean;
    colors?: boolean;
    triangles?: boolean;
    lines?: boolean;
  }

  // src/mesh.js
// Represents indexed triangle geometry with arbitrary additional attributes.
// You need a shader to draw a mesh; meshes can't draw themselves.
//
// A mesh is a collection of `GL.Buffer` objects which are either vertex buffers
// (holding per-vertex attributes) or index buffers (holding the order in which
// vertices are rendered). By default, a mesh has a position vertex buffer called
// `vertices` and a triangle index buffer called `triangles`. New buffers can be
// added using `addVertexBuffer()` and `addIndexBuffer()`. Two strings are
// required when adding a new vertex buffer, the name of the data array on the
// mesh instance and the name of the GLSL attribute in the vertex shader.
//
// Example usage:
//
//     var mesh = new GL.Mesh({ coords: true, lines: true });
//
//     // Default attribute "vertices", available as "gl_Vertex" in
//     // the vertex shader
//     mesh.vertices = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]];
//
//     // Optional attribute "coords" enabled in constructor,
//     // available as "gl_TexCoord" in the vertex shader
//     mesh.coords = [[0, 0], [1, 0], [0, 1], [1, 1]];
//
//     // Custom attribute "weights", available as "weight" in the
//     // vertex shader
//     mesh.addVertexBuffer('weights', 'weight');
//     mesh.weights = [1, 0, 0, 1];
//
//     // Default index buffer "triangles"
//     mesh.triangles = [[0, 1, 2], [2, 1, 3]];
//
//     // Optional index buffer "lines" enabled in constructor
//     mesh.lines = [[0, 1], [0, 2], [1, 3], [2, 3]];
//
//     // Upload provided data to GPU memory
//     mesh.compile();

  
  // ### new GL.Mesh([options])
//
// Represents a collection of vertex buffers and index buffers. Each vertex
// buffer maps to one attribute in GLSL and has a corresponding property set
// on the Mesh instance. There is one vertex buffer by default: `vertices`,
// which maps to `gl_Vertex`. The `coords`, `normals`, and `colors` vertex
// buffers map to `gl_TexCoord`, `gl_Normal`, and `gl_Color` respectively,
// and can be enabled by setting the corresponding options to true. There are
// two index buffers, `triangles` and `lines`, which are used for rendering
// `gl.TRIANGLES` and `gl.LINES`, respectively. Only `triangles` is enabled by
// default, although `computeWireframe()` will add a normal buffer if it wasn't
// initially enabled.
class Mesh {
    private gl: WebGLRenderingContext
    vertexBuffers: { [key: string]: Buffer<Float32Array> } = {}
    indexBuffers: { [key: string]: Buffer<Uint16Array> } = {}
    data: { coords: number[][],
        vertices: number[][],
        normals: number[][],
        triangles: number[][],
        colors: number[][],
        lines: number[][]} = {coords:[], vertices: [], normals:[], triangles: [], colors: [], lines: []}
    
  
    constructor(gl: WebGLRenderingContext, options: MeshOptions = {}) {
    this.gl = gl;
      this.addVertexBuffer('vertices', 'VertexPosition');
      if (options.coords) this.addVertexBuffer('coords', 'TexCoord');
      if (options.normals) this.addVertexBuffer('normals', 'Normal');
      if (options.colors) this.addVertexBuffer('colors', 'Color');
      if (!('triangles' in options) || options.triangles) this.addIndexBuffer('triangles');
      if (options.lines) this.addIndexBuffer('lines');
    }
  
    // Add a new vertex buffer with a list as a property called `name` on this object
    // and map it to the attribute called `attribute` in all shaders that draw this mesh.
    addVertexBuffer(name: string, attribute: string): void {
        this.vertexBuffers[attribute] = new Buffer(this.gl, 34962, Float32Array);
        this.vertexBuffers[attribute].name = name;
    }
  
    // Add a new index buffer with a list as a property called `name` on this object.
    addIndexBuffer(name: string): void {
      this.indexBuffers[name] = new Buffer(this.gl, this.gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
    }

    getData(name: string): number[][]
    {
        if(name === 'coords'){
            return this.data.coords
        }
        
        if(name === 'normals'){
            return this.data.normals
        }
        
        if(name === 'triangles'){
            return this.data.triangles
        }
        
        if(name === 'colors'){
            return this.data.colors
        }
        
        if(name === 'lines'){
            return this.data.lines
        }

        if(name === 'vertices'){
            return this.data.vertices
        }
        
        return []
    }
  
    // Upload all attached buffers to the GPU in preparation for rendering. This
    // doesn't need to be called every frame, only needs to be done when the data
    // changes.
    compile(): void {
      for (const attribute in this.vertexBuffers) {
        const buffer = this.vertexBuffers[attribute];
        buffer.data = this.getData(buffer.name);
        buffer.compile();
      }
  
      for (const name in this.indexBuffers) {
        const buffer = this.indexBuffers[name];
        buffer.data = this.getData(name);
        buffer.compile();
      }
    }

      // bd = billboard - s,t,u,v - texturing (probably got the names wrong). sx/sy: the "scale" (width vs height)
    static plane(gl:WebGLRenderingContext, s:number, t:number, u:number, v:number, sx:number, sy:number){
        
        const m = new Mesh(gl, { coords: true /*, normals: true*/ });
        sx = sx || 1.0;
        sy = sy || 1.0;
    
        s /= 1024.0;
        t /= 1024.0;
        u /= 1024.0;
        v /= 1024.0;
    
        m.data.vertices   = [ [-1 * sx, -1 * sy, 0], [1 * sx, -1 * sy, 0], [-1 * sx, 1 * sy, 0], [1 * sx, 1 * sy, 0] ];  // XY PLANE (looking at the player)
        //mesh.normals    = [ [0,0,1], [0,0,1], [0,0,1], [0,0,1] ]; // XY PLANE (looking forward)  // we don't need normals!
        m.data.coords      = [ [s, t], [u, t], [s, v], [u, v] ];  
        m.data.triangles  = [ [0, 1, 2], [2, 1, 3] ];
        m.compile();
        return m;
    }

  // this allows you to specify individual planes (or combinations of them) using the same row approach for texturing
  // we assume you define at least one of them lol
  static box(gl:WebGLRenderingContext, row:number, cfg:string){ //s, t, u, v, sx, sy) 
        row = row || 0;

        const m = new Mesh(gl, { coords: true }) //, normals: true }); // perhaps we don't need normals?
        const g = cfg.includes("G");
        const c = cfg.includes("C");
        const b = cfg.includes("B");
        const l = cfg.includes("L");
        const r = cfg.includes("R");
        const f = cfg.includes("F");
        let t = (1024.0 - (16.0 * row)) / 1024.0;
        let s = t - (16.0 / 1024.0);
        const u = t;
  
        t = s;
        s = u;
      //console.log("wtf ", row, s, t)
  
        m.data.vertices      = [];
        m.data.coords        = [];
        m.data.triangles     = [];
  
        // 16           / 128 = 0.125
        // (16 + 16)    / 128 = 0.25
        // (32 + 32)    / 128 = 0.5
        // (64 + 32)    / 128 = 0.75
        // (96 + 32)    / 128 = 1


        if(g)
        {
            m.data.vertices.push(    [-1,0,-1],  [ 1, 0,-1],  [-1, 0, 1],  [ 1, 0, 1]    ); // ground G 
            m.data.coords.push(      [0, s],     [0.125, s],  [0, t],      [0.125, t]    );
        }
        if(c)
        { 
            m.data.vertices.push(    [-1,1,-1],  [ 1, 1,-1],  [-1, 1, 1],  [ 1, 1, 1]    ); // ceiling  C
            m.data.coords.push(      [0.125, s], [0.25,  s],  [0.125, t],  [0.25,  t]    );
        }
        if(b)
        {
            m.data.vertices.push(    [-1,0,-1],  [ 1, 0,-1],  [-1, 1,-1],  [ 1, 1,-1]    ); // back     B
            m.data.coords.push(      [0.25, s],  [0.5,   s],  [0.25,  t],  [0.5,   t]    );
        }
        if(l)
        {
            m.data.vertices.push(    [-1,0,-1],  [-1, 0, 1],  [-1, 1,-1],  [-1, 1, 1]    ); // left     L
            m.data.coords.push(      [0.5,  s],  [0.75,  s],  [0.5,   t],  [0.75,  t]    );
        }
        if(r)
        {
            m.data.vertices.push(    [ 1,0,-1],  [ 1, 0, 1],  [ 1, 1,-1],  [ 1, 1, 1]    ); // right    R
            m.data.coords.push(      [0.75, s],  [1,  s],     [0.75,  t],  [1,     t]    );
        }
        if(f)
        {
            m.data.vertices.push(    [-1,0, 1],  [ 1, 0, 1],  [-1, 1, 1],  [ 1, 1, 1]    ); // front     F
            m.data.coords.push(      [1,    s],  [0.75,  s],  [1,     t],  [0.75,  t]    );
        }

        // stride
        let de = 0;
        for(let i = 0; i < cfg.length; i++)
        {
            de = i * 4;
            m.data.triangles.push(   [0 + de, 1 + de, 2 + de], [2 + de, 1 + de, 3 + de]   );
        }

        //console.log("box test: ", m);
        m.compile();
        return m;
    }
  
  }

  export default Mesh;

  
  
  
  
  
  

  
  

