/* eslint-disable @typescript-eslint/no-explicit-any */
import Vector from './Vector'
import Matrix from './Matrix'
import Mesh from './Mesh';
import Buffer from './Buffer';
import Engine from '.';
import ModelView from './ModelView';

// src/shader.js
// Provides a convenient wrapper for WebGL shaders. A few uniforms and attributes,
// prefixed with `gl_`, are automatically added to all shader sources to make
// simple shaders easier to write.
//
// Example usage:
//
//     var shader = new GL.Shader('\
//       void main() {\
//         gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
//       }\
//     ', '\
//       uniform vec4 color;\
//       void main() {\
//         gl_FragColor = color;\
//       }\
//     ');
//
//     shader.uniforms({
//       color: [1, 0, 0, 1]
//     }).draw(mesh);

function regexMap(regex:RegExp, text:string, callback: (result:RegExpExecArray|string) => void) {
    let result = null;
    while ((result = regex.exec(text)) !== null) {
      if(result === null){
        continue;
      }
      callback(result);
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isArray(obj: any) {
    const str = Object.prototype.toString.call(obj);
    return str == '[object Array]' || str == '[object Float32Array]';
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isNumber(obj: any) {
    const str = Object.prototype.toString.call(obj);
    return str == '[object Number]' || str == '[object Boolean]';
  }
  

const vertexHeader = `
// Start - This is automatically injected by engine
uniform mat4 ModelViewProjectionMatrix;
attribute vec4 VertexPosition;
attribute vec4 TexCoord;
attribute vec3 Normal;
attribute vec4 Color;
// End - This is automatically injected by engine

`;

const fragmentHeader = `
// Start - This is automatically injected by engine
precision highp float;
uniform mat4 ModelViewProjectionMatrix;
// End - This is automatically injected by engine

`;

const builtInUniforms = ['ModelViewProjectionMatrix']

class Shader {

    private context: WebGLRenderingContext;
    private program: WebGLProgram;
    private uniformLocations: { [key: string]: WebGLUniformLocation } = {}
    private attributesLocation: { [key: string]: number } = {};
    private uniformSamplers: { [key: string]: number } = {}
    private usedMatrices: { [key: string]: string } = {}
    private modelView: ModelView


    constructor(engine: Engine, vertexSource: string, fragmentSource:string){
      
      this.context = engine.glContext
      this.modelView = engine.modelView

      // Inject automatic headers
      vertexSource = `${vertexHeader}${vertexSource}`
      fragmentSource = `${fragmentHeader}${fragmentSource}`

      // Check for the use of built-in matrices that require expensive matrix
      // multiplications to compute, and record these in `usedMatrices`.
      const source = vertexSource + fragmentSource;
      const usedMatrices: { [key: string]: string } = {};

      builtInUniforms.map(builtInUniform => {
        if (source.indexOf(builtInUniform) !== -1) {
          usedMatrices[builtInUniform] = builtInUniform;
        }
      })

      console.log(usedMatrices, 111234)

      this.usedMatrices = usedMatrices;

      const program = this.context.createProgram();

      if(!program){
        throw new Error('program was not created ');
      }

      this.program = program;

      const compiledVertex = this.compileSource(engine.glContext.VERTEX_SHADER, vertexSource);

      if(!compiledVertex){
        throw new Error('could not compile vertex shader');
      }

      const compiledFragment = this.compileSource(engine.glContext.FRAGMENT_SHADER, fragmentSource);

      if(!compiledFragment){
        throw new Error('could not compile fragment shader');
      }

      this.context.attachShader(this.program, compiledVertex);
      this.context.attachShader(this.program, compiledFragment);
      this.context.linkProgram(this.program);

      if (!this.context.getProgramParameter(this.program, this.context.LINK_STATUS))   // :(
      {
          throw new Error('link error: ' + this.context.getProgramInfoLog(this.program));
      }

      this.attributesLocation = {};
      this.uniformLocations = {};

      this.setUniformSamplers(source)

      this.context.useProgram(this.program);
    }

    compileSource(type:number, source:string) {
        const shader = this.context.createShader(type);
        if(!shader){
          return;
        }
        this.context.shaderSource(shader, source);
        this.context.compileShader(shader);
        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
          throw new Error('compile error: ' + this.context.getShaderInfoLog(shader));
        }
        return shader;
      }

    /**
     * Uniforms of type sampler need to be uploaded using `gl.uniform1i()` 
     * instead of `gl.uniform1f()`. To do this automatically, we detect 
     * and remember all uniform samplers in the source code
     * @param source 
     */
    setUniformSamplers(source: string){
      const uniformSamplers: { [key: string]: number } = {};

      regexMap(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, source, function(groups) {
        uniformSamplers[groups[2]] = 1;
      });

      this.uniformSamplers = uniformSamplers;
    }

    /**
     * Set a uniform for each property of `uniforms`. 
     * The correct `gl.uniform*()` method is inferred from the value types 
     * and from the stored uniform sampler flags.
     * @param uniforms 
     * @returns 
     */
    uniforms(uniforms: { [x: string]: any }) {
      for (const name in uniforms) {

        const location = this.uniformLocations[name] || 
          this.context.getUniformLocation(this.program, name)

        if (!location) continue

        this.uniformLocations[name] = location

        let value = uniforms[name]

        if (value instanceof Vector) {
            value = [value.x, value.y, value.z];
        } else if (value instanceof Matrix) {
            value = value.m;
        }

        if (isArray(value)) {
          switch (value.length) {
            case 1: this.context.uniform1fv(location, new Float32Array(value)); break;
            case 2: this.context.uniform2fv(location, new Float32Array(value)); break;
            case 3: this.context.uniform3fv(location, new Float32Array(value)); break;
            case 4: this.context.uniform4fv(location, new Float32Array(value)); break;
            // Matrices are automatically transposed, since WebGL uses column-major
            // indices instead of row-major indices.
            case 9: this.context.uniformMatrix3fv(location, false, new Float32Array([
                    value[0], value[3], value[6],
                    value[1], value[4], value[7],
                    value[2], value[5], value[8]
            ])); break;
            case 16: this.context.uniformMatrix4fv(location, false, new Float32Array([
                    value[0], value[4], value[8], value[12],
                    value[1], value[5], value[9], value[13],
                    value[2], value[6], value[10], value[14],
                    value[3], value[7], value[11], value[15]
            ])); break;
            default: throw new Error('don\'t know how to load uniform "' + name + '" of length ' + value.length);
          }
        } else if (isNumber(value)) {
          const uniform1 = this.uniformSamplers[name] ? this.context.uniform1i : this.context.uniform1f
          uniform1.bind(this.context)(location, value);
        } else {
          throw new Error('attempted to set uniform "' + name + '" to invalid value ' + value);
        }
      }

      return this;
    }

    /**
     * Draw mesh geometry as indexed triangles or indexed lines
     * Set `mode` to `this.context.LINES` and either add indices to `lines` or
     * call `computeWireframe()`) to draw the mesh in wireframe
     */
    draw(mesh:Mesh) {
        this.drawBuffers(
            mesh.vertexBuffers,
            mesh.indexBuffers['triangles'],
            this.context.TRIANGLES
        )
    }

    /**
     * Sets all uniform matrix attributes, binds all relevant buffers
     * and draws the indexed mesh geometry
     * 
     * The `vertexBuffers` argument is a map from attribute 
     * names to `Buffer` objects of type `this.context.ARRAY_BUFFER`
     * 
     * The `mode` is a WebGL primitive mode
     * like `this.context.TRIANGLES` or `this.context.LINES`
     * 
     * This method automatically creates and caches vertex attribute pointers 
     * for attributes as needed
     * 
     * @param vertexBuffers 
     * @param indexBuffer 
     * @param mode 
     * @returns 
     */
    private drawBuffers(
      vertexBuffers:{[key:string] : Buffer<Float32Array>}, 
      indexBuffer:Buffer<Uint16Array>, 
      mode:number) {

        // Only construct up the built-in matrices we need for this shader.
        if(this.usedMatrices[builtInUniforms[0]]){
          const MVM = this.modelView.getModelviewMatrix();
          const PM = this.modelView.getProjectionMatrix();

          // clipSpacePosition = projectionMat * translationMat * rotationMat * scaleMat * position
          // Matrix multiplication is assosiative: (a*b)*c=a*(b*c)
          // We have here a=PM (projectionMat), b=MVM (translationMat * rotationMat * scaleMat)
          // and c is the vertex position
          this.uniforms({[builtInUniforms[0]]: PM.multiply(MVM)});
        }

        // Create and enable attribute pointers as necessary.
        let length = 0;
        
        for (const attribute in vertexBuffers) 
        {
            const buffer = vertexBuffers[attribute];
            const location = this.attributesLocation[attribute] || this.context.getAttribLocation(this.program, attribute);
            if (location == -1 || !buffer.buffer) continue;
            this.attributesLocation[attribute] = location;
            this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer.buffer);
            this.context.enableVertexAttribArray(location);
            this.context.vertexAttribPointer(location, buffer.spacing, this.context.FLOAT, false, 0, 0);
            length = buffer.length / buffer.spacing;
        }

        // Disable unused attribute pointers.
        for (const attribute in this.attributesLocation) 
        {
            if (!(attribute in vertexBuffers)) 
            {
                this.context.disableVertexAttribArray(this.attributesLocation[attribute]);
            }
        }

        // Draw the geometry.
        if (length && (!indexBuffer || indexBuffer.buffer)) 
        {
          if (indexBuffer) 
          {
                this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
                this.context.drawElements(mode, indexBuffer.length, this.context.UNSIGNED_SHORT, 0);
            }
            else 
            {
                this.context.drawArrays(mode, 0, length);
            }
        }

        return this;
    }

}

export default Shader;


