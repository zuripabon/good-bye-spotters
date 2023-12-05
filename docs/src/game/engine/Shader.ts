import Vector from './Vector'
import Matrix from './Matrix'
import Mesh from './Mesh';
import Buffer from './Buffer';
import Engine from '.';

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

function followScriptTagById(id:string) {
    const element = document.getElementById(id);
    if(element && element.textContent){
        return element.textContent
    }
    return id;
}

function regexMap(regex:RegExp, text:string, callback: (result:RegExpExecArray|string) => void) {
    let result = null;
    while ((result = regex.exec(text)) !== null) {
      if(result === null){
        continue;
      }
      callback(result);
    }
  }

// The `gl_` prefix must be substituted for something else to avoid compile
// errors, since it's a reserved prefix. This prefixes all reserved names with
// `_`. The header is inserted after any extensions, since those must come
// first.
function fix(header:string, source:string) {
    const replaced:{[key:string]:boolean} = {};
    const match = /^((\s*\/\/.*\n|\s*#extension.*\n)+)[^]*$/.exec(source);
    source = match ? match[1] + header + source.substr(match[1].length) : header + source;
    regexMap(/\bgl_\w+\b/g, header, function(result) {
      const r = result as string
      if (!(replaced[r])) {
        source = source.replace(new RegExp('\\b' + r + '\\b', 'g'), LIGHTGL_PREFIX + r);
        replaced[r] = true;
      }
    });
    return source;
  }


  // Compile and link errors are thrown as strings.

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
  
        /*
// ORIGINAL HEADERS
  var header = '\
    uniform mat3 gl_NormalMatrix;\
    uniform mat4 gl_ModelViewMatrix;\
    uniform mat4 gl_ProjectionMatrix;\
    uniform mat4 gl_ModelViewProjectionMatrix;\
    uniform mat4 gl_ModelViewMatrixInverse;\
    uniform mat4 gl_ProjectionMatrixInverse;\
    uniform mat4 gl_ModelViewProjectionMatrixInverse;\
  ';
  var vertexHeader = header + '\
    attribute vec4 gl_Vertex;\
    attribute vec4 gl_TexCoord;\
    attribute vec3 gl_Normal;\
    attribute vec4 gl_Color;\
    vec4 ftransform() {\
      return gl_ModelViewProjectionMatrix * gl_Vertex;\
    }\
  ';
*/


  // Headers are prepended to the sources to provide some automatic functionality.
  // bring them back if we need them
  //     uniform mat3 gl_NormalMatrix;\
//    uniform mat4 gl_ModelViewMatrix;\
//    uniform mat4 gl_ProjectionMatrix;\



// BRING BACK NORMAL and color IF WE NEED Them 
//attribute vec3 gl_Normal;\
//attribute vec4 gl_Color;\
//
// and we don't need ftransform because we do it anyways
//
//    vec4 ftransform() {\
//    return gl_ModelViewProjectionMatrix * gl_Vertex;\
//    }\  

const header = '\
uniform mat4 gl_ModelViewProjectionMatrix;\
';
const vertexHeader = header + '\
  attribute vec4 gl_Vertex;\
  attribute vec4 gl_TexCoord;\
';
const fragmentHeader = '\
  precision highp float;\
' + header;
  // Non-standard names beginning with `gl_` must be mangled because they will
// otherwise cause a compiler error.
const LIGHTGL_PREFIX = 'LIGHTGL';

class Shader {

    private context: WebGLRenderingContext;
    private program: WebGLProgram;
    private uniformLocations: { [key: string]: WebGLUniformLocation } = {}
    private attributes: { [key: string]: number } = {};
    private isSampler: { [key: string]: number } = {}
    private usedMatrices: { [key: string]: string } = {}
    private modelviewMatrix:Matrix
    private projectionMatrix: Matrix


    constructor(context: Engine, vertexSource: string, fragmentSource:string){
        this.context = context.glContext
        this.modelviewMatrix = context.modelviewMatrix
        this.projectionMatrix = context.projectionMatrix
        vertexSource = followScriptTagById(vertexSource);
        fragmentSource = followScriptTagById(fragmentSource);


        // Check for the use of built-in matrices that require expensive matrix
        // multiplications to compute, and record these in `usedMatrices`.
        const source = vertexSource + fragmentSource;
        const usedMatrices: { [key: string]: string } = {};

        regexMap(/\b(gl_[^;]*)\b;/g, header, function(groups) {
            const name = groups[1];
            if (source.indexOf(name) != -1) {
                const capitalLetters = name.replace(/[a-z_]/g, '');
                usedMatrices[capitalLetters] = LIGHTGL_PREFIX + name;
            }
        });

        if (source.indexOf('ftransform') !== -1) usedMatrices['MVPM'] = LIGHTGL_PREFIX + 'gl_ModelViewProjectionMatrix';
        this.usedMatrices = usedMatrices;


        vertexSource = fix(vertexHeader, vertexSource);
        fragmentSource = fix(fragmentHeader, fragmentSource);


        const program = this.context.createProgram();

        if(!program){
          throw new Error('program was not created ');
        }

        this.program = program;

        const compiledVertex = this.compileSource(35633 /*gl.VERTEX_SHADER*/, vertexSource);

        if(!compiledVertex){
          throw new Error('could not compile vertex shader');
        }

        const compiledFragment = this.compileSource(35632 /*gl.FRAGMENT_SHADER*/, fragmentSource);

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

        this.attributes = {};
        this.uniformLocations = {};

        // Sampler uniforms need to be uploaded using `gl.uniform1i()` instead of `gl.uniform1f()`.
        // To do this automatically, we detect and remember all uniform samplers in the source code.
        const isSampler: { [key: string]: number } = {};
        regexMap(/uniform\s+sampler(1D|2D|3D|Cube)\s+(\w+)\s*;/g, vertexSource + fragmentSource, function(groups) {
            isSampler[groups[2]] = 1;
        });

        this.isSampler = isSampler;
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

    // ### .uniforms(uniforms)
    //
    // Set a uniform for each property of `uniforms`. The correct `gl.uniform*()` method is
    // inferred from the value types and from the stored uniform sampler flags.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uniforms(uniforms: { [x: string]: any }) 
    {

      
        this.context.useProgram(this.program);

        for (const name in uniforms) 
        {
            const location = this.uniformLocations[name] || this.context.getUniformLocation(this.program, name);
            if (!location) continue;
            this.uniformLocations[name] = location;
            let value = uniforms[name];
            if (value instanceof Vector) 
            {
                value = [value.x, value.y, value.z];
            }
            else if (value instanceof Matrix) 
            {
                value = value.m;
            }

            if (isArray(value)) 
            {
                switch (value.length) 
                {
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
            }
            else if (isNumber(value)) 
            {
                (this.isSampler[name] ? this.context.uniform1i : this.context.uniform1f).call(this.context, location, value);
            }

            // todo: remove these for the final build!
            else 
            {
                throw new Error('attempted to set uniform "' + name + '" to invalid value ' + value);
            }
        }

        return this;
    }

    // ### .draw(mesh[, mode])
    //
    // Sets all uniform matrix attributes, binds all relevant buffers, and draws the
    // mesh geometry as indexed triangles or indexed lines. Set `mode` to `this.context.LINES`
    // (and either add indices to `lines` or call `computeWireframe()`) to draw the
    // mesh in wireframe.
    draw(mesh:Mesh) {
        this.drawBuffers(
            mesh.vertexBuffers,
            mesh.indexBuffers['triangles'],
            this.context.TRIANGLES
        )  // we probably could simplify this bit of code and remove the lines part...
    }


    // ### .drawBuffers(vertexBuffers, indexBuffer, mode)
    //
    // Sets all uniform matrix attributes, binds all relevant buffers, and draws the
    // indexed mesh geometry. The `vertexBuffers` argument is a map from attribute
    // names to `Buffer` objects of type `this.context.ARRAY_BUFFER`, `indexBuffer` is a `Buffer`
    // object of type `this.context.ELEMENT_ARRAY_BUFFER`, and `mode` is a WebGL primitive mode
    // like `this.context.TRIANGLES` or `this.context.LINES`. This method automatically creates and caches
    // vertex attribute pointers for attributes as needed.
    drawBuffers(vertexBuffers:{[key:string] : Buffer<Float32Array>}, indexBuffer:Buffer<Uint16Array>, mode:number) {
        // Only construct up the built-in matrices we need for this shader.
        // BRING THEM BACK IF WE NEED THEM !!!!
        const used = this.usedMatrices;
        const MVM = this.modelviewMatrix;
        const PM = this.projectionMatrix;
//        var MVMI = (used.MVMI || used.NM) ? MVM.inverse() : null;
//        var PMI = (used.PMI) ? PM.inverse() : null;
//        var MVPM = (used.MVPM || used.MVPMI) ? PM.multiply(MVM) : null; // original

        const MVPM = used.MVPM ? PM.multiply(MVM) : null;
        const matrices:{[key:string]:Matrix} = {};
//        if (used.MVM) matrices[used.MVM] = MVM;
//        if (used.MVMI) matrices[used.MVMI] = MVMI;
//        if (used.PM) matrices[used.PM] = PM;
//        if (used.PMI) matrices[used.PMI] = PMI;
        if (used.MVPM && MVPM) matrices[used.MVPM] = MVPM;
//        if (used.MVPMI) matrices[used.MVPMI] = MVPM.inverse();
  
/*      
        if (used.NM) 
        {
            var m = MVMI.m;
            matrices[used.NM] = [m[0], m[4], m[8], m[1], m[5], m[9], m[2], m[6], m[10]];
        }
*/

        this.uniforms(matrices);

        // Create and enable attribute pointers as necessary.
        let length = 0;
        
        for (const attribute in vertexBuffers) 
        {
            const buffer = vertexBuffers[attribute];
            const location = this.attributes[attribute] || this.context.getAttribLocation(this.program, attribute.replace(/^(gl_.*)$/, LIGHTGL_PREFIX + '$1'));
            if (location == -1 || !buffer.buffer) continue;
            this.attributes[attribute] = location;
            this.context.bindBuffer(34962 /*this.context.ARRAY_BUFFER*/, buffer.buffer);
            this.context.enableVertexAttribArray(location);
            this.context.vertexAttribPointer(location, buffer.spacing, 5126 /*this.context.FLOAT*/, false, 0, 0);
            length = buffer.length / buffer.spacing;
        }

        // Disable unused attribute pointers.
        for (const attribute in this.attributes) 
        {
            if (!(attribute in vertexBuffers)) 
            {
                this.context.disableVertexAttribArray(this.attributes[attribute]);
            }
        }

        // Draw the geometry.
        if (length && (!indexBuffer || indexBuffer.buffer)) 
        {
          if (indexBuffer) 
          {
                this.context.bindBuffer(34963 /*this.context.ELEMENT_ARRAY_BUFFER*/, indexBuffer.buffer);
                this.context.drawElements(mode, indexBuffer.length, 5123 /*this.context.UNSIGNED_SHORT*/, 0);
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


