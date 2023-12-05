// Provides a simple 3D vector class. Vector operations can be done using member
// functions, which return new vectors, or static functions, which reuse
// existing vectors to avoid generating garbage.
class Vector {
    x: number
    y: number
    z: number

    constructor(x:number, y:number, z:number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    add(v: Vector | number):Vector {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }
    
    subtract(v: Vector | number) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }
}

export default Vector;
  
 