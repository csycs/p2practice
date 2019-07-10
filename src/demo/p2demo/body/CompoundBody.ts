/**
 * 复合刚体的实现
 */
class CompoundBody extends BaseClass {
    private _world: p2.World;
    private _planeBody: p2.Body;
    private _sprite: egret.Sprite;
    private _ball_ballBody: p2.Body;
    constructor() {
        super();
        this._sprite = new egret.Sprite();
        Global.main.addChild(this._sprite);
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createCompound();
        egret.Ticker.getInstance().register(this.update, this);
    }

    private createWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];
    }

    private createPlane() {
        let planeShape: p2.Plane = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, Global.stage.stageHeight * 0.9]
        });
        this._planeBody.displays = [];
        this._planeBody.angle = Math.PI;
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private createCompound() {
        this.createBall_Box();
    }

    private _display1: any;
    private _display2: any;
    private _display3: any;
    private createBall_Box() {
        let ballShape1: p2.Box = new p2.Box({ width: 60, height: 40 });
        let ballShape2: p2.Circle = new p2.Circle({ radius: 30 });
        let ballShape3: p2.Circle = new p2.Circle({ radius: 30 });
        this._ball_ballBody = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });
        let a1: Array<number> = [], a2: Array<number> = [], a3: Array<number> = [];
        this._ball_ballBody.toWorldFrame(a1, [0, 50]);
        this._ball_ballBody.toWorldFrame(a2, [-50, -50]);
        this._ball_ballBody.toWorldFrame(a3, [50, -50]);
        this._display1 = this.drawBox(a1[0], a1[1] , 60, 40);
        this._display2 = this.drawCircle(a2[0], a2[1], 30);
        this._display3 = this.drawCircle(a3[0], a3[1], 30);
        this._ball_ballBody.displays = [this._display1, this._display2, this._display3];
        this._ball_ballBody.addShape(ballShape1, [0, 50], 0);
        this._ball_ballBody.addShape(ballShape2, [-50, -50], 0);
        this._ball_ballBody.addShape(ballShape3, [50, -50], 0);
        this._world.addBody(this._ball_ballBody);
        this._ball_ballBody.adjustCenterOfMass();
        this._ball_ballBody.mass = 2;
        this._ball_ballBody.updateMassProperties();
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        // this._world.step(60 / 1000);
        this._sprite.graphics.clear();
        let a1: Array<number> = [], a2: Array<number> = [], a3: Array<number> = [];
        this._ball_ballBody.toWorldFrame(a1, [0, 50]);
        this._ball_ballBody.toWorldFrame(a2, [-50, -50]);
        this._ball_ballBody.toWorldFrame(a3, [50, -50]);
        this._display1 = this.drawBox(a1[0], a1[1] , 60, 40);
        this._display2 = this.drawCircle(a2[0], a2[1], 30);
        this._display3 = this.drawCircle(a3[0], a3[1], 30);
    }

    private drawBox(x, y, w, h) {
        this._sprite.graphics.lineStyle(1, Color.FILL);
        this._sprite.graphics.beginFill(Color.CIRCLE, 1);
        this._sprite.graphics.drawRect(x, y, w, h);
        this._sprite.graphics.endFill();
        Global.main.addChild(this._sprite);
        return this._sprite;
    }

    private drawCircle(x, y, r) {
        this._sprite.graphics.lineStyle(1, Color.FILL);
        this._sprite.graphics.beginFill(Color.CIRCLE, 1);
        this._sprite.graphics.drawCircle(x, y, r);
        this._sprite.graphics.endFill();
        Global.main.addChild(this._sprite);
        return this._sprite;
    }
}