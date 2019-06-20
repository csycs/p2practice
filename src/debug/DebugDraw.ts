enum Color {
    STATIC = 0x7fb80e,
    BOX = 0xfcaf17,
    PLANE = 0xffd400,
    FILL = 0x7f7522
}

class DebugDraw {

    private _world: p2.World;
    private _shape: egret.Shape;
    private _factor: number = 50;
    constructor(world, shape) {
        this._world = world;
        this._shape = shape;
    }

    //渲染函数
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
                display.x = body.position[0] * this._factor;
                display.y = Global.stage.stageHeight - body.position[1] * this._factor;
                display.rotation = 360 - body.angle * 180 / Math.PI;
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
    }

    private createPlane(shape, body) {
        this._shape = new egret.Shape();
        this._shape.graphics.beginFill(Color.PLANE, 1);
        this._shape.graphics.drawRect(0, 0, Global.stage.stageWidth, 20);
        this._shape.graphics.endFill();
        body.displays = [this._shape];
        body.position[0] /= this._factor;
        body.position[1] /= this._factor;
        Global.main.addChild(this._shape);
    }

    private createBox(shape, body) {
        this._shape = new egret.Shape();
        this._shape.graphics.lineStyle(2, Color.BOX);
        this._shape.graphics.beginFill(Color.FILL, 1);
        this._shape.graphics.moveTo(((-shape.width / 2) * this._factor), (( -shape.height / 2) * this._factor));
        this._shape.graphics.lineTo(((shape.width / 2) * this._factor), ((-shape.height / 2) * this._factor));
        this._shape.graphics.lineTo(((shape.width / 2) * this._factor), ((shape.height / 2) * this._factor));
        this._shape.graphics.lineTo(((-shape.width / 2) * this._factor), ((shape.height / 2) * this._factor));
        this._shape.graphics.lineTo(((-shape.width / 2) * this._factor), ((-shape.height / 2) * this._factor));
        body.position[0] /= this._factor;
        body.position[1] /= this._factor;
        body.displays = [this._shape];
        Global.main.addChild(this._shape);
    }
}