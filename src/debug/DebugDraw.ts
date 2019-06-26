enum Color {
    STATIC = 0x7fb80e,
    BOX = 0xfcaf17,
    PLANE = 0xffd400,
    FILL = 0x7f7522,
    LINE = 0xf05b72,
    CIRCLE = 0x7fb80e,
    PARTICLE = 0x2a5caa,
    CAPSULE = 0x33a3dc
}
class DebugDraw {
    private _world: p2.World;
    private _factor: number = 50;

    constructor(world) {
        this._world = world;
    }

    public drawDebug() {
        let bLength = this._world.bodies.length;
        for (let i = 0; i < bLength; i++) {
            let body = this._world.bodies[i];
            let sLength = body.shapes.length;
            for (let j = 0; j < sLength; j++) {
                let shape = body.shapes[j];
                if (!body.displays) this.drawShape(shape, body);
            }

            let display = body.displays[0];
            if (display) {
                let shape = body.shapes[0];
                display.x = body.position[0] * this._factor;
                display.y = body.position[1] * this._factor;
                if (shape instanceof p2.Plane) {
                    display.rotation = display.rotation;
                }
                else {
                    display.rotation = body.angle * 180 / Math.PI;
                }
                if (body.sleepState === p2.Body.SLEEPING) {
                    display.alpha = 0.5;
                } else {
                    display.alpha = 1;
                }
            }
        }
    }


    private drawShape(shape, body) {
        if (shape instanceof p2.Plane) {
            this.createPlane(shape, body);
        } else if (shape instanceof p2.Box) {
            this.createBox(shape, body);
        }
        else if (shape instanceof p2.Circle) {
            this.createCircle(shape, body);
        } else if (shape instanceof p2.Particle) {
            this.createParticle(shape, body);
        } else if (shape instanceof p2.Line) {
            this.createLine(shape, body);
        } 
        // else if (shape instanceof p2.Capsule) {
        //     this.createCapsule(shape, body);
        // }
    }

    private createPlane(shape, body) {
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.clear();
        sprite.graphics.lineStyle(1, Color.FILL);
        sprite.graphics.beginFill(Color.PLANE, 1);
        sprite.graphics.drawRect(0, 0, Global.stage.stageWidth, 75);
        sprite.graphics.endFill();
        body.displays = [sprite];
        sprite.x = body.position[0] * this._factor;
        sprite.y = body.position[1] * this._factor;
        Global.main.addChild(sprite);
    }

    private createBox(shape, body) {
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.clear();
        sprite.graphics.lineStyle(2, Color.FILL);
        sprite.graphics.beginFill(Color.BOX, 1);
        sprite.graphics.drawRect(0, 0, shape.width * this._factor, shape.height * this._factor);
        sprite.graphics.endFill();
        body.displays = [sprite];
        sprite.x = body.position[0] * this._factor;
        sprite.y = body.position[1] * this._factor;
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        Global.main.addChild(sprite);
    }

    private createCircle(shape, body) {
        let centerPos: Array<number> = [];
        body.toWorldFrame(centerPos, [0, 0]);
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.clear();
        sprite.graphics.lineStyle(2, Color.FILL);
        sprite.graphics.beginFill(Color.CIRCLE, 1);
        sprite.graphics.drawCircle(0, 0, shape.radius * this._factor);
        sprite.graphics.endFill();
        body.displays = [sprite];
        sprite.x = body.position[0] * this._factor;
        sprite.y = body.position[1] * this._factor;
        Global.main.addChild(sprite);
    }

    private createParticle(shape, body) {
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.lineStyle(1, Color.FILL);
        sprite.graphics.beginFill(Color.PARTICLE, 1);
        sprite.graphics.drawCircle(0, 0, 2);
        sprite.graphics.endFill();
        body.displays = [sprite];
        sprite.x = body.position[0] * this._factor;
        sprite.y = body.position[1] * this._factor;
        Global.main.addChild(sprite);
    }

    private createLine(shape, body) {
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.lineStyle(1, Color.FILL);
        sprite.graphics.beginFill(Color.LINE, 1);
        sprite.graphics.drawRect(0, 0, shape.length * this._factor, 2);
        sprite.graphics.endFill();
        body.displays = [sprite];
        sprite.x = body.position[0] * this._factor;
        sprite.y = body.position[1] * this._factor;
        Global.main.addChild(sprite);
    }

    private createCapsule(shape, body) {
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.lineStyle(1, Color.FILL);
        sprite.graphics.beginFill(Color.CAPSULE, 1);
        sprite.graphics.drawCircle(0, shape.radius * this._factor, shape.radius * this._factor);
        sprite.graphics.drawRect(0, 0, (shape.length) * this._factor, shape.radius * 2 * this._factor);
        sprite.graphics.drawCircle((shape.length) * this._factor, shape.radius * this._factor, shape.radius * this._factor);

        sprite.graphics.endFill();
        body.displays = [sprite];
        sprite.x = body.position[0] * this._factor;
        sprite.y = body.position[1] * this._factor;
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        Global.main.addChild(sprite);
    }

    public transform_disValue_to_p2Value(value) {
        return value / this._factor;
    }

    public transform_p2Value_to_disValue(value) {
        return value * this._factor;
    }

}
