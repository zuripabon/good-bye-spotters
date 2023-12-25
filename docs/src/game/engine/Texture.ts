
// Provides a simple wrapper around WebGL textures that supports render-to-texture.
// The arguments `width` and `height` give the size of the texture in texels.
// WebGL texture dimensions must be powers of two unless `filter` is set to
// either `gl.NEAREST` or `gl.LINEAR` and `wrap` is set to `gl.CLAMP_TO_EDGE`
// (which they are by default).
//
// Texture parameters can be passed in via the `options` argument.
// Example usage:
//
//     var t = new GL.Texture(256, 256, {
//       // Defaults to gl.LINEAR, set both at once with "filter"
//       magFilter: gl.NEAREST,
//       minFilter: gl.LINEAR,
//
//       // Defaults to gl.CLAMP_TO_EDGE, set both at once with "wrap"
//       wrapS: gl.REPEAT,
//       wrapT: gl.REPEAT,
//
//       format: gl.RGB, // Defaults to gl.RGBA
//       type: gl.FLOAT // Defaults to gl.UNSIGNED_BYTE
//     });
class Texture {

    private id: WebGLTexture | null
    private format 
    private type 

    constructor(context: WebGLRenderingContext, image: HTMLImageElement, unit:number = 0) {
        this.id = context.createTexture()
        this.format = context.RGBA
        this.type = context.UNSIGNED_BYTE
    
        const magFilter = context.NEAREST
        const minFilter = context.NEAREST 

        context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1)
        context.activeTexture(context.TEXTURE0 + (unit|| 0))
        context.bindTexture(context.TEXTURE_2D, this.id)
        
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, magFilter)
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, minFilter)
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
        context.texImage2D(context.TEXTURE_2D, 0, this.format, this.format, this.type, image);
    }

    static fromImage(context: WebGLRenderingContext, image: HTMLImageElement) {
        const texture = new Texture(context, image);
        return texture;
    }
}

export default Texture
