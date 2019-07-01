/**
 * p2刚体的本地坐标向全局坐标的转换
 */
class P2ToWorldFrame extends BaseClass {
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createBox();
        this.createDebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
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

    private _boxBody: p2.Body;
    private createBox() {
        let boxShape: p2.Box = new p2.Box({ width: 150, height: 60 });
        this._boxBody = new p2.Body({
            mass: 1,
            type: p2.Body.STATIC,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });
        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
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
        this.drawBoxBodyCenterWith_toWorldFrame();
    }

    /**
     * 在矩形刚体的中心以及距离圆心右边 20 的地方画圆形，以说明 toWorldFrame 的作用
     */
    private drawBoxBodyCenterWith_toWorldFrame() {
        let p1: Array<number> = [];
        this._boxBody.toWorldFrame(p1, [0, 0])
        let sprite: egret.Sprite = new egret.Sprite();
        sprite.graphics.clear();
        sprite.graphics.lineStyle(1, Color.FILL);
        sprite.graphics.beginFill(Color.CIRCLE, 1);
        sprite.graphics.drawCircle(p1[0], p1[1], 5);
        sprite.graphics.drawCircle(p1[0] + 20, p1[1], 5);
        sprite.graphics.endFill();
        Global.main.addChild(sprite);
    }
}