class PersonalDebugDraw extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    constructor() {
        super();
    }

    public init() {
        this.createScene();
        this.initBox(Global.stage.stageWidth / 2, Global.stage.stageHeight * 0.5);
        this.createDebugDraw();

        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }

    private createScene() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;

        let planeShape = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, Global.stage.stageHeight * 0.1]
        });

        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private _boxBody: p2.Body;
    private initBox(x, y) {
        let boxShape = new p2.Box({ width: 2, height: 1 });
        this._boxBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            angularVelocity: 1,
            position: [x, y]
        });

        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private onClickHandler(e: egret.TouchEvent) {
        this.initBox(e.stageX, Global.stage.stageHeight - e.stageY);
    }

    private _debugDraw: DebugDraw;
    private createDebugDraw() {
        let shape = new egret.Shape();
        this._debugDraw = new DebugDraw(this._world, shape);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        this._debugDraw.drawDebug();
    }
}