import Vector from './Vector'
import Mesh from './Mesh'

export const on = (element: Window | Document | HTMLElement, name:string, callback: () =>void) => {
    element.addEventListener(name, callback);
}
  
export const off = (element: Window | Document | HTMLElement, name:string, callback: () =>void) => {
    element.removeEventListener(name, callback);
}

export const rn = function(a:number, b:number){
    return Math.random() * (b - a + 1) + a;
};

export const mo = function(mesh:Mesh, t:number, px:number, py:number, pz:number, dx:number, dy:number, dz:number, x:string, y:string, n:string, o:number) // meshes are visible by default, set to 0 to make them non visible
{
    const r = {
        m: mesh,        // mesh. can be null (ie the player)
        v: 1,                               // 1: visible. 0: not visible
        p: new Vector(px, py, pz),       // position
        d: new Vector(dx, dy, dz),       // dimensions
        mn: new Vector(0, 0, 0),         // mn: the min bb vector
        mx: new Vector(0, 0, 0),         // mx: the max bb vector
        t: t,                               // object type
        a: 0,                               // angle (only bullets use that for now). this is used only for movement, has no effect on drawing
        x: x,                               // text to say upon contact
        y: y,                               // YES answer
        n: n,                               // NO answer
        o: o,                               // resout OUTCOME
        h: 0,                               // h: counter of how many times its message has been shown - only valid for npcs
        l: 1.0,                             // light override (used to multiply the final color of the sprite, useful for making sprites brighter)
        s: 1.0,                             // scale (gl.scale)
        f: 0.0                              // factor (animate this shit). 0 = original sprite. 1 = new sprite (32 pixels up)
    };

    return r;
};


export const text = function(what:string){
    const dialogElement = document.getElementById("upper");
    if(!dialogElement){
        return
    }
    dialogElement.style.display = 'none';
    if(what === ""){
        return
    }
    dialogElement.innerHTML = what;
    dialogElement.style.display = 'block';
};

// set the "tint color" for the "text" label
export const ttc = function(color:string){
    const dialogElement = document.getElementById("upper");
    if(!dialogElement || color === ""){
        return;
    }
    dialogElement.style.color = color;
};


export const clamp = function(a:number,b:number,c:number){
    return Math.min(Math.max(a, b), c);
};


// aabb vs aabb
// we assume a and b have two vectors mn (min) and mx (max) which determine their bounding box
// you need to call update on them (usp) so the min and max are calculated based on their (p)osition +- (d)imensions
export const abab = function(a: [Vector, Vector], b: [Vector, Vector]){
    return (
        a[0].x <= b[1].x && 
        a[1].x >= b[0].x && 
        a[0].y <= b[1].y && 
        a[1].y >= b[0].y && 
        a[1].z <= b[1].z && 
        a[1].z >= b[0].z
    );
};

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}
