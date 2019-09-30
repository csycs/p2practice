/**
 * 凹多变形的示例
 * 在p2中，是没有凹多边形真实存在的
 * 所以是通过 body 中的 fromPolygon 方法，去规定一组 path 的值，间接实现
 * 给多边形贴图
 */
class ConcaveShape extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _concaveBody: p2.Body;
    private _sprite: egret.Sprite;
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createConcave();
        this._sprite = new egret.Sprite();
        egret.Ticker.getInstance().register(this.update, this);

        this.initMouseControl();
    }

    private initMouseControl() {
        let mouseControl = new MouseControl(this._world);
        mouseControl.startMouseSearch();
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
        let bmp: egret.Bitmap = EngineControl.getInstance().createBitmapByName("rect_png");
        bmp.width = Global.stage.stageWidth;
        bmp.height = 30;
        bmp.anchorOffsetX = bmp.width;
        bmp.anchorOffsetY = bmp.height;
        bmp.x = this._planeBody.position[0] + bmp.width * .5;
        bmp.y = this._planeBody.position[1] - 30;
        this._planeBody.displays = [bmp];
        this._world.addBody(this._planeBody);
        Global.main.addChild(bmp);
    }

    private createConcave() {
        this._concaveBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });

        let path = [
            [-348 / 2, -287 / 2], [-376 / 2, -240 / 2], [-402 / 2, -195 / 2], [-402 / 2, -170 / 2],
            [-387 / 2, -170 / 2], [-387 / 2, 287 / 2], [-351 / 2, 287 / 2], [-304 / 2, 166 / 2],
            [-304 / 2, -139 / 2], [304 / 2, -139 / 2], [304 / 2, 166 / 2], [351 / 2, 287 / 2], 
            [387 / 2, 287 / 2], [387 / 2, -170 / 2], [402 / 2, -170 / 2], [402 / 2, -195 / 2],
            [368 / 2, -240 / 2], [333 / 2, -287 / 2]
            
        ]
        this._concaveBody.fromPolygon(path);
        this._world.addBody(this._concaveBody);

        let bmp: egret.Bitmap = EngineControl.getInstance().createBitmapByName("table_png");
        this._concaveBody.displays = [bmp];
        bmp.width = 402;
        bmp.height = 287;
        bmp.anchorOffsetX = bmp.width * .5;
        bmp.anchorOffsetY = bmp.height * .5 - 57;
        bmp.x = this._concaveBody.position[0];
        bmp.y = this._concaveBody.position[1];
        Global.main.addChild(bmp);
    }

    private drawConcave() {
        var path: any[] = this._concaveBody["concavePath"];
        var l: number = path.length;
        let g = this._sprite.graphics;
        g.clear();
        var worldPoint: number[] = [this._concaveBody.position[0], this._concaveBody.position[1]];
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.CONVEX, 0.5);
        g.drawCircle(worldPoint[0], worldPoint[1], 10);
        g.moveTo(worldPoint[0], worldPoint[1]);
        g.lineStyle(1, 0x00ff00);
        for (var i: number = 0; i < l; i++) {
            this._concaveBody.toWorldFrame(worldPoint, path[i]);
            g.moveTo(worldPoint[0], worldPoint[1]);
            this._concaveBody.toWorldFrame(worldPoint, path[(i + 1) % l]);
            g.lineTo(worldPoint[0], worldPoint[1]);
        }
        g.endFill();
        Global.main.addChild(this._sprite);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        // this._world.step(60 / 1000);
        this.drawConcave();

        let l = this._world.bodies.length;
        for (let i = 0; i < l; i++) {
            // 取到每一个刚体
            let body: p2.Body = this._world.bodies[i];
            // 取到每个刚体的贴图
            if (!body.displays[0]) continue;
            let bodyDisplay = body.displays[0];
            if (bodyDisplay) {
                bodyDisplay.x = body.position[0];
                bodyDisplay.y = body.position[1];
                bodyDisplay.rotation = body.angle * 180 / Math.PI;
                if (body.sleepState === p2.Body.SLEEPING) {
                    bodyDisplay.alpha = 0.5;
                } else {
                    bodyDisplay.alpha = 1;
                }
            }
        }
    }
}