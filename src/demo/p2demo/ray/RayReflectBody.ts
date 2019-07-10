class RayReflectBody extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _boxBody: p2.Body;
    private _debugDraw: DebugDraw;
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createBox();
        this.createRay();
        this.createMouse();
        this.createDebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
    }

    private createWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 0];
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

    private createBox() {
        let boxShape: p2.Box = new p2.Box({ width: 50, height: 150 });
        this._boxBody = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });
        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private _ray: p2.Ray;
    private _result: p2.RaycastResult;
    private _hitPoint: number[];
    private createRay() {
        this._ray = new p2.Ray({
            mode: p2.Ray.CLOSEST
        });
        this._result = new p2.RaycastResult();
        this._hitPoint = p2.vec2.create();
    }

    private createMouse() {
        let mouseControl = new MouseControl(this._world);
        mouseControl.startMouseSearch();
    }

    private createDebugDraw() {
        let sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    private updateRays() {
        let hits = 0;
        this._ray.from[0] = 0;
        this._ray.from[1] = Global.stage.stageHeight / 2;
        this._ray.to[0] = Global.stage.stageWidth * 0.8;
        this._ray.to[1] = Global.stage.stageHeight / 2;
        this._ray.update();
        while (this._world.raycast(this._result, this._ray) && hits++ < 5) {
            this._result.getHitPoint(this._hitPoint, this._ray);
            this._debugDraw.drawRay(this._ray.from, this._hitPoint);
            p2.vec2.copy(this._ray.from, this._hitPoint);
            this._ray.update();
            //反射
            p2.vec2.reflect(this._ray.direction, this._ray.direction, this._result.normal);
            this._result.reset();

            //将击中刚体的点的坐标赋值给射线的from，然后再基于法线进行反射，绘制出反射的路径
            this._ray.from[0] += this._ray.direction[0] * 0.001;
            this._ray.from[1] += this._ray.direction[1] * 0.001;
            this._ray.to[0] = this._ray.from[0] + this._ray.direction[0] * 1000;
            this._ray.to[1] = this._ray.from[1] + this._ray.direction[1] * 1000;
        }
        this._debugDraw.drawRay(this._ray.from, this._ray.to);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        this._debugDraw.drawDebug();
        this.updateRays();
    }
}