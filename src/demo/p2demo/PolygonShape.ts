class PolygonShape extends BaseClass {
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createDebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    private _world: p2.World;
    private createWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];
    }

    private _planeBody: p2.Body;
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

    private _triangleBody: p2.Body;
    private createConvex_triangle(x, y) {
        let vertices = [[-30, -40], [30, -40], [0, 40]];
        let convexShape1: p2.Convex = new p2.Convex({ vertices: vertices });
        this._triangleBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._triangleBody.addShape(convexShape1);
        this._world.addBody(this._triangleBody);
    }

    private _polygonBody: p2.Body;
    private createConvex_polygon(x, y) {
        let vertices = [[-30, -40], [30, -40], [40, 0], [50, 20], [30, 40], [-30, 30], [-40, 20], [-40, 0]];
        let convexShape: p2.Convex = new p2.Convex({ vertices: vertices });
        this._polygonBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._polygonBody.addShape(convexShape);
        this._world.addBody(this._polygonBody);
    }

    private onClick(e: egret.TouchEvent) {
        let random = Math.random();
        if (random <= 0.5) {
            this.createConvex_triangle(e.stageX, e.stageY);
        } else {
            this.createConvex_polygon(e.stageX, e.stageY);
        }
    }

    private _debugDraw: DebugDraw;
    private createDebugDraw() {
        let sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    public update(dt) {
        if (dt < 10 || dt > 1000) return;
        // this._world.step(dt / 1000);
        this._world.step(60 / 1000);
        this._debugDraw.drawDebug();
    }
}