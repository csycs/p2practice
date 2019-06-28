enum Color {
    STATIC = 0x7fb80e,
    CONVEX = 0xfcaf17,
    PLANE = 0xffd400,
    FILL = 0x7f7522,
    LINE = 0xf05b72,
    CIRCLE = 0x7fb80e,
    PARTICLE = 0x2a5caa,
    CAPSULE = 0x33a3dc
}
class DebugDraw {

    private _world: p2.World;
    private _sprite: egret.Sprite;
    constructor(world, sprite) {
        this._world = world;
        this._sprite = sprite;
    }

    public drawDebug() {
        this._sprite.graphics.clear();
        let bLength = this._world.bodies.length;
        for (let i = 0; i < bLength; i++) {
            let body = this._world.bodies[i];
            let sLength = body.shapes.length;
            for (let j = 0; j < sLength; j++) {
                let shape = body.shapes[j];
                if (shape instanceof p2.Plane) {
                    this.drawPlane(shape, body);
                } else if (shape instanceof p2.Circle) {
                    this.drawCircle(shape, body);
                } else if (shape instanceof p2.Convex) {
                    this.drawConvex(shape, body);
                } else if (shape instanceof p2.Line) {
                    this.drawLine(shape, body);
                } else if (shape instanceof p2.Particle) {
                    this.drawParticle(shape, body);
                } else if (shape instanceof p2.Capsule) {
                    this.drawCapsule(shape, body);
                } else if (shape instanceof p2.Heightfield) {
                    this.drawHeightsField(shape, body);
                }
            }
        }
    }

    private drawPlane(shape, body) {
        let p1: Array<number> = [], p2: Array<number> = [], p3: Array<number> = [], p4: Array<number> = [];
        body.toWorldFrame(p1, [-Global.stage.stageWidth, 0]);
        body.toWorldFrame(p2, [Global.stage.stageWidth, 0]);
        body.toWorldFrame(p3, [Global.stage.stageWidth, -Global.stage.stageHeight * 0.1]);
        body.toWorldFrame(p4, [-Global.stage.stageWidth, -Global.stage.stageHeight * 0.1]);
        let g = this._sprite.graphics;
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.PLANE, 1);
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
        g.lineTo(p3[0], p3[1]);
        g.lineTo(p4[0], p4[1]);
        g.lineTo(p1[0], p1[1]);
        g.endFill();
    }

    private drawCircle(shape, body) {
        let center: Array<number> = [];
        body.toWorldFrame(center, [shape.radius, 0]);
        let g = this._sprite.graphics;
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.CIRCLE, 1);
        g.drawCircle(body.position[0], body.position[1], shape.radius);
        g.moveTo(body.position[0], body.position[1]);
        g.lineTo(center[0], center[1]);
        g.endFill();
    }

    private drawConvex(shape, body) {
        let l = shape.vertices.length;
        let g = this._sprite.graphics;
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.CONVEX, 1);
        let worldPoint: Array<number> = new Array();
        body.toWorldFrame(worldPoint, shape.vertices[0]);
        g.moveTo(body.position[0], body.position[1]);
        g.lineTo(worldPoint[0], worldPoint[1]);
        for (let i = 1; i <= l; i++) {
            body.toWorldFrame(worldPoint, shape.vertices[i % l]);
            g.lineTo(worldPoint[0], worldPoint[1]);
        }
        // for (let i = 0; i <= l; i++) {
        //     body.toWorldFrame(worldPoint, shape.vertices[i % l]);
        //     g.lineTo(worldPoint[0], worldPoint[1]);
        // }
        g.endFill();
    }

    private drawLine(shape, body) {
        let p1: Array<number> = [], p2: Array<number> = [];
        body.toWorldFrame(p1, [-shape.length / 2, 0]);
        body.toWorldFrame(p2, [shape.length / 2, 0]);
        let g = this._sprite.graphics;
        g.lineStyle(2, Color.LINE);
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
        g.endFill();
    }

    private drawParticle(shape, body) {
        let g = this._sprite.graphics;
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.PARTICLE, 1);
        g.drawCircle(body.position[0], body.position[1], 1);
        g.endFill();
    }

    private drawCapsule(shape, body) {
        let a1: Array<number> = [], a2: Array<number> = [];
        let p1: Array<number> = [], p2: Array<number> = [], p3: Array<number> = [], p4: Array<number> = [];
        body.toWorldFrame(p1, [-shape.length / 2, -shape.radius]);
        body.toWorldFrame(p2, [shape.length / 2, -shape.radius]);
        body.toWorldFrame(p3, [shape.length / 2, shape.radius]);
        body.toWorldFrame(p4, [-shape.length / 2, shape.radius]);
        body.toWorldFrame(a1, [-shape.length / 2, 0]);
        body.toWorldFrame(a2, [shape.length / 2, 0]);
        let g = this._sprite.graphics;
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.CAPSULE, 1);
        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);
        g.lineTo(p3[0], p3[1]);
        g.lineTo(p4[0], p4[1]);
        g.lineTo(p1[0], p1[1]);
        g.drawCircle(a1[0], a1[1], shape.radius);
        g.drawCircle(a2[0], a2[1], shape.radius);
        g.endFill();
    }

    private drawHeightsField(shape, body) {
        let heights = shape.heights;
        let g = this._sprite.graphics;
        g.lineStyle(1, Color.LINE);
        g.moveTo(body.position[0], heights[0]);
        for (let i = 1; i <= heights.length; i++) {
            let xx = body.position[0] + i * shape.elementWidth;
            g.lineTo(xx, heights[i]);
        }
        g.endFill();
    }
}