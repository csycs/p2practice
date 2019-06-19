/**
 * 测试debugDraw的使用方法
 */
class DebugDrawTest extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _boxBody: p2.Body;

    public init() {

        this.initWorld();
        this.initPlane();
        this.createDebug();

        //执行step函数
        egret.Ticker.getInstance().register(this.update, this);
        //舞台添加点击事件，点击出现物体
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
    }

    private initWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];
    }

    private initPlane() {
        let planeShape: p2.Plane = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, Global.stage.stageHeight * 0.9]
        });

        this._planeBody.angle = Math.PI;
        this._planeBody.displays = [];
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private initBox(x, y) {
        let boxShape: p2.Shape = new p2.Box({ width: 100, height: 60 });
        this._boxBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            position: [x, y],
            angularVelocity: 1
        });
        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private debugDraw: simpleP2DebugDraw;
    private createDebug() {
        //创建调试试图
        this.debugDraw = new simpleP2DebugDraw(this._world);
        var sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this.debugDraw.setSprite(sprite);
    }

    private onButtonClick(e: egret.TouchEvent) {
        this.initBox(e.stageX, e.stageY);
    }

    private update(dt) {
        //step的参数与帧率是对应的，具体的对应关系需要再查一查资料
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 100);
        this.debugDraw.drawDebug();
    }
}