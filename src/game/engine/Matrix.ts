class Matrix {
  m: Float32Array;

  constructor(...params: number[]) {
    // eslint-disable-next-line prefer-rest-params
    const args = [...params];
    if (!args.length) {
      args.push(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }
    this.m = new Float32Array(args);
  }

  multiply(matrix: Matrix): Matrix {
    return Matrix.multiply(this, matrix, new Matrix());
  }

  static multiply(left: Matrix, right: Matrix, result?: Matrix): Matrix {
    result = result || new Matrix();
    const a = left.m, b = right.m, r = result.m;

    r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    r[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

    r[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    r[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    r[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    r[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

    r[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    r[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    r[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    r[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

    r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

    return result;
  }

  static identity(result?: Matrix): Matrix {
    result = result || new Matrix();
    const m = result.m;
    m[0] = m[5] = m[10] = m[15] = 1;
    m[1] = m[2] = m[3] = m[4] = m[6] = m[7] = m[8] = m[9] = m[11] = m[12] = m[13] = m[14] = 0;
    return result;
  }

  static perspective(fov: number, aspect: number, near: number, far: number, result?: Matrix): Matrix {
    const y = Math.tan(fov * Math.PI / 360) * near;
    const x = y * aspect;
    return Matrix.frustum(-x, x, -y, y, near, far, result);
  }

  static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, result?: Matrix): Matrix {
    result = result || new Matrix();
    const m = result.m;

    m[0] = 2 * near / (right - left);
    m[1] = 0;
    m[2] = (right + left) / (right - left);
    m[3] = 0;

    m[4] = 0;
    m[5] = 2 * near / (top - bottom);
    m[6] = (top + bottom) / (top - bottom);
    m[7] = 0;

    m[8] = 0;
    m[9] = 0;
    m[10] = -(far + near) / (far - near);
    m[11] = -2 * far * near / (far - near);

    m[12] = 0;
    m[13] = 0;
    m[14] = -1;
    m[15] = 0;

    return result;
  }

  static scale(x: number, y: number, z: number, result?: Matrix): Matrix {
    result = result || new Matrix();
    const m = result.m;

    m[0] = x;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;

    m[4] = 0;
    m[5] = y;
    m[6] = 0;
    m[7] = 0;

    m[8] = 0;
    m[9] = 0;
    m[10] = z;
    m[11] = 0;

    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;

    return result;
  }

  static translate(x: number, y: number, z: number, result?: Matrix): Matrix {
    result = result || new Matrix();
    const m = result.m;

    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = x;

    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = y;

    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = z;

    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;

    return result;
  }

  static rotate(a: number, x: number, y: number, z: number, result?: Matrix): Matrix {
    if (!a || (!x && !y && !z)) {
      return Matrix.identity(result);
    }

    result = result || new Matrix();
    const m = result.m;

    const d = Math.sqrt(x * x + y * y + z * z);
    a *= Math.PI / 180; x /= d; y /= d; z /= d;
    const c = Math.cos(a), s = Math.sin(a), t = 1 - c;

    m[0] = x * x * t + c;
    m[1] = x * y * t - z * s;
    m[2] = x * z * t + y * s;
    m[3] = 0;

    m[4] = y * x * t + z * s;
    m[5] = y * y * t + c;
    m[6] = y * z * t - x * s;
    m[7] = 0;

    m[8] = z * x * t - y * s;
    m[9] = z * y * t + x * s;
    m[10] = z * z * t + c;
    m[11] = 0;

    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;

    return result;
  }
}

export default Matrix
