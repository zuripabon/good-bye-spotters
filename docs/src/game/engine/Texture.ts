// src/texture.js
// Provides a simple wrapper around WebGL textures that supports render-to-texture.

// ### new GL.Texture(width, height[, options])
//
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

// TODO: CHECK IF WE CAN SIMPLIFY THIS CLUSTERFUCK

class Texture {

    private id: WebGLTexture | null;
    private context:WebGLRenderingContext;
    private format:number = 6408 /*gl.RGBA*/;  
    private type 

    constructor(context: WebGLRenderingContext, options: { format?: number; type?: number; filter?: number; magFilter?: number; minFilter?: number; wrap?: number; wrapS?: number; wrapT?: number; } | undefined = {}) {
        this.context = context;
        this.id = context.createTexture();
        this.format = options.format || 6408 /*gl.RGBA*/;  
        this.type = options.type || 5121 /*gl.UNSIGNED_BYTE*/;
    
        const magFilter = options.filter || options.magFilter || 9728 /*gl.NEAREST*/; // gl.LINEAR; //
        const minFilter = options.filter || options.minFilter || 9728 /*gl.NEAREST*/; //gl.LINEAR;
        
        context.bindTexture(3553 /*gl.TEXTURE_2D*/, this.id);
        context.pixelStorei(37440 /*gl.UNPACK_FLIP_Y_WEBGL*/, 1);
        
        //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); // now we are using enable blend and it works lol
        
        // TODO: CHECK IF WE CAN SIMPLIFY THIS!!!
        context.texParameteri(3553  /*context.TEXTURE_2D*/, 10240 /*context.TEXTURE_MAG_FILTER*/, magFilter);
        context.texParameteri(3553  /*context.TEXTURE_2D*/, 10241 /*context.TEXTURE_MIN_FILTER*/, minFilter);
        context.texParameteri(3553  /*context.TEXTURE_2D*/, 10242 /*context.TEXTURE_WRAP_S*/, options.wrap || options.wrapS || 33071 /*context.CLAMP_TO_EDGE*/);  
        context.texParameteri(3553  /*context.TEXTURE_2D*/, 10243 /*context.TEXTURE_WRAP_T*/, options.wrap || options.wrapT || 33071 /*context.CLAMP_TO_EDGE*/);
        context.texImage2D(3553 /*gl.TEXTURE_2D*/, 0, this.format, 1024, 1024, 0, this.format, this.type, null);
        
    }

    // ### .bind([unit])
    // Bind this texture to the given texture unit (0-7, defaults to 0).
    bind(unit:number) {
        this.context.activeTexture(33984 /*gl.TEXTURE0*/ + (unit || 0));
        this.context.bindTexture(3553 /*gl.TEXTURE_2D*/, this.id);
    }

    // ### GL.Texture.fromImage(image[, options])
    // Return a new image created from `image`, an `<img>` tag.
    static fromImage(context: WebGLRenderingContext, image: HTMLImageElement,  options: { format?: number; type?: number; filter?: number; magFilter?: number; minFilter?: number; wrap?: number; wrapS?: number; wrapT?: number; } | undefined = {}) {
        const texture = new Texture(context, options);
        try {
            context.texImage2D(3553 /*gl.TEXTURE_2D*/, 0, texture.format, texture.format, texture.type, image);
        } 
        catch (e) 
        {
            console.log("no texture");
        }

        // no mipmaps
        //if (options.minFilter && options.minFilter != gl.NEAREST && options.minFilter != gl.LINEAR) {
        //  gl.generateMipmap(3553 /*gl.TEXTURE_2D*/);
        //}
        return texture;
    }
}

export default Texture
