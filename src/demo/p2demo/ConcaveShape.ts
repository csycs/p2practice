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

    private createConcave() {
        this._concaveBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        });
        let path = [[-50, 50], [-50, 0], [50, 0], [50, 50], [25, 25]];
        this._concaveBody.fromPolygon(path);
        this._world.addBody(this._concaveBody);
    }

    private drawConcave() {
        var path: any[] = this._concaveBody["concavePath"];
        var l: number = path.length;
        let g = this._sprite.graphics;
        g.clear();
        var worldPoint: number[] = [this._concaveBody.position[0], this._concaveBody.position[1]];
        g.lineStyle(1, Color.FILL);
        g.beginFill(Color.CONVEX, 1);
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
    }
}