export class Transform
{
    constructor(x = 0, y = 0)
    {
        this.matrix = [1, 0, 0, 1, x, y];
    }

    setMatrix(m11, m12, m21, m22, m31, m32)
    {
        this.matrix[0] = m11;
        this.matrix[1] = m12;
        this.matrix[2] = m21;
        this.matrix[3] = m22;
        this.matrix[4] = m31;
        this.matrix[5] = m32;
        return this;
    }

    setPosition(x, y)
    {
        this.matrix[4] = x;
        this.matrix[5] = y;
        return this;
    }

    setRotation(radians)
    {
        let scaleX = this.scaleX;
        let scaleY = this.scaleY;
        this.matrix[0] = Math.cos(radians) * scaleX;
        this.matrix[1] = Math.sin(radians);
        this.matrix[2] = -this.matrix[1];
        this.matrix[3] = Math.cos(radians) * scaleY;
        return this;
    }

    setScale(sx, sy = sx)
    {
        let rcos = Math.cos(this.rotation);
        this.matrix[0] = rcos * sx;
        this.matrix[3] = rcos * sy;
        return this;
    }

    // NOTE: This is for ease of access
    get x() { return this.matrix[4]; }
    set x(value) { this.matrix[4] = value; }
    get y() { return this.matrix[5]; }
    set y(value) { this.matrix[5] = value; }
    get rotation() { return Math.asin(this.matrix[1]); }
    set rotation(value) {
        let scaleX = this.scaleX;
        let scaleY = this.scaleY;
        this.matrix[0] = Math.cos(value) * scaleX;
        this.matrix[1] = Math.sin(value);
        this.matrix[2] = -this.matrix[1];
        this.matrix[3] = Math.cos(value) * scaleY;
    }
    get scaleX() { return this.matrix[0] / Math.cos(this.rotation); }
    set scaleX(value) { this.matrix[0] = Math.cos(this.rotation) * value; }
    get scaleY() { return this.matrix[3] / Math.cos(this.rotation); }
    set scaleY(value) { this.matrix[3] = Math.cos(this.rotation) * value; }

    // NOTE: This supports 2D DOMMatrix manipulation (such as transform() or setTransform())
    get a() { return this.matrix[0]; }
    get b() { return this.matrix[1]; }
    get c() { return this.matrix[2]; }
    get d() { return this.matrix[3]; }
    get e() { return this.matrix[4]; }
    get f() { return this.matrix[5]; }

    // NOTE: This supports array access (such as gl-matrix)
    get 0() { return this.matrix[0]; }
    set 0(value) { this.matrix[0] = value; }
    get 1() { return this.matrix[1]; }
    set 1(value) { this.matrix[1] = value; }
    get 2() { return this.matrix[2]; }
    set 2(value) { this.matrix[2] = value; }
    get 3() { return this.matrix[3]; }
    set 3(value) { this.matrix[3] = value; }
    get 4() { return this.matrix[4]; }
    set 4(value) { this.matrix[4] = value; }
    get 5() { return this.matrix[5]; }
    set 5(value) { this.matrix[5] = value; }
    // NOTE: These should never change for 2D transformations
    get 6() { return 0; }
    get 7() { return 0; }
    get 8() { return 1; }
    get length() { return 9; }
}
