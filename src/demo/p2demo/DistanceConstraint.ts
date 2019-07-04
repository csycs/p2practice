/**
 *  距离约束：保持两个刚体之间的距离不变
 *  构造函数的前两个参数为要进行设置的两个刚体
 *  之后可以对两个刚体的目标点进行设置，两个目标点之间的距离即为约束要保持的距离
 *  如果不设置目标点，则目标点默认为两个刚体的锚点
 */
class DistanceConstraint extends BaseClass {
    private _world: p2.World;
    private _planeBody: p2.Body;
    private _boxBody1: p2.Body;
    private _boxBody2: p2.Body;
    private _debugDraw: DebugDraw;
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createBody1();
        this.createBody2();
        this.createEquation();
        this.createMouseControl();
        this.createDebugDraw();
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
        this._planeBody.angle = Math.PI;
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private createBody1() {
        let boxShape: p2.Box = new p2.Box({ width: 100, height: 60 });
        this._boxBody1 = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });
        this._boxBody1.addShape(boxShape);
        this._world.addBody(this._boxBody1);
    }

    private createBody2() {
        let boxShape: p2.Box = new p2.Box({ width: 100, height: 60 });
        this._boxBody2 = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth / 2 + 400, Global.stage.stageHeight / 2]
        });
        this._boxBody2.addShape(boxShape);
        this._world.addBody(this._boxBody2);
    }

    private _distanceConstraint: p2.DistanceConstraint;
    private createEquation() {
        this._distanceConstraint = new p2.DistanceConstraint(this._boxBody1, this._boxBody2, { distance: 100 });
        this._world.addConstraint(this._distanceConstraint);
    }

    private createMouseControl() {
        let mouseControl: MouseControl = new MouseControl(this._world);
        mouseControl.startMouseSearch();
    }

    private createDebugDraw() {
        let sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        this._debugDraw.drawDebug();
    }
}