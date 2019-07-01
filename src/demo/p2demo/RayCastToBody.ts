class RayCastToBody extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _cricleBody: p2.Body;
    private _debugDraw: DebugDraw;
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createCircle();
        this.createRay();
        this.initMouseControl();
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

    private createCircle() {
        let circleShape: p2.Circle = new p2.Circle({ radius: 50 });
        this._cricleBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });
        this._cricleBody.addShape(circleShape);
        this._world.addBody(this._cricleBody);
    }

    private _ray: p2.Ray;
    private _hitPoint: number[];
    private _rayCastResult: p2.RaycastResult;
    private createRay() {
        this._ray = new p2.Ray({
            mode: p2.Ray.CLOSEST
        });
        this._hitPoint = p2.vec2.create();
        this._rayCastResult = new p2.RaycastResult();
    }

    private initMouseControl() {
        let mouseControl = new MouseControl(this._world);
        mouseControl.startMouseSearch();
    }

    private createDebugDraw() {
        let sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    private updateRay() {
        this._ray.from[0] = Global.stage.stageWidth * 0.4;
        this._ray.from[1] = Global.stage.stageHeight * 0.5;
        this._ray.to[0] = Global.stage.stageWidth * 0.6;
        this._ray.to[1] = Global.stage.stageHeight * 0.8;
        this._ray.update();
        if (this._world.raycast(this._rayCastResult, this._ray)) {
            console.log("射线检测到刚体");
            this._rayCastResult.getHitPoint(this._hitPoint, this._ray);
            this._debugDraw.drawRay(this._ray.from, this._hitPoint);
        } else {
            this._debugDraw.drawRay(this._ray.from, this._ray.to);
        }
        this._rayCastResult.reset();
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        this._debugDraw.drawDebug();
        this.updateRay();
    }
}