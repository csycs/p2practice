class GearConstraint extends BaseClass {
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
        this.createConstraint();
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

    private _gearConstraint: p2.GearConstraint;
    private _distanceConstraint: p2.DistanceConstraint;
    private createConstraint() {
        this._gearConstraint = new p2.GearConstraint(this._boxBody1, this._boxBody2, { angle: 0.5 });
        this._world.addConstraint(this._gearConstraint);
        this._distanceConstraint = new p2.DistanceConstraint(this._boxBody1, this._boxBody2, { distance: 150 });
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