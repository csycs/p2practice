class PersonalDebugDraw extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _circleBody: p2.Body;
    private _boxBody: p2.Body;
    private _lineBody: p2.Body;
    private _particleBody: p2.Body;
    private _capsuleBody: p2.Body;
    constructor() {
        super();
    }

    public init() {
        this.createScene();
        this.initBottomPlane();
        this.initLeftGround();
        this.initRightGround();
        this.initBox(Global.stage.stageWidth / 2, Global.stage.stageHeight * 0.5);
        this.createDebugDraw();

        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }

    private createScene() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
    }

    //平面形状 Plane
    private initBottomPlane() {
        let planeShape = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            //TODO 地面的位置，这个问题还需要优化
            position: [0, Global.stage.stageHeight * 0.1]
        });
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private initLeftGround() {
        let planeShape = new p2.Box({ width: 0.5, height: 50 });
        let planeBody = new p2.Body({
            mass: 1,
            type: p2.Body.STATIC,
            //TODO 地面的位置，这个问题还需要优化
            position: [0, 0]
        });
        planeBody.addShape(planeShape);
        this._world.addBody(planeBody);
    }

    private initRightGround() {
        let planeShape = new p2.Box({ width: 0.5, height: 50 });
        let planeBody = new p2.Body({
            mass: 1,
            type: p2.Body.STATIC,
            //TODO 地面的位置，这个问题还需要优化
            position: [Global.stage.stageWidth, 0]
        });
        planeBody.addShape(planeShape);
        this._world.addBody(planeBody);
    }

    //矩形 Box
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

    //圆形 Circle
    private initCircle(x, y) {
        let circelShape = new p2.Circle({ redius: 0.7 });
        this._circleBody = new p2.Body({
            mass: 1,
            position: [x, y]
        });
        this._circleBody.addShape(circelShape);
        this._world.addBody(this._circleBody);
    }

    //线形 Line
    private initLine(x, y) {
        let lineShape = new p2.Line({ length: 1.6 });
        this._lineBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        })
        this._lineBody.addShape(lineShape);
        this._world.addBody(this._lineBody);
    }

    //粒子形状 particle
    private initParticle(x, y) {
        let particleShape: p2.Particle = new p2.Particle();
        this._particleBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._particleBody.addShape(particleShape);
        this._world.addBody(this._particleBody);
    }

    //胶囊形状 capsule
    private initCapsule(x, y) {
        let capsuleShape: p2.Capsule = new p2.Capsule({ length: 2, radius: 0.4 });
        this._capsuleBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        })
        this._capsuleBody.addShape(capsuleShape);
        this._world.addBody(this._capsuleBody);
    }

    private onClickHandler(e: egret.TouchEvent) {
        //TODO 点击屏幕的位置，这个问题也需要处理
        // if (Math.random() <= 0.2) {
        //     this.initBox(e.stageX, Global.stage.stageHeight - e.stageY);
        // } else if (Math.random() > 0.2 && Math.random() <= 0.4) {
        //     this.initLine(e.stageX, Global.stage.stageHeight - e.stageY);
        // } else if (Math.random() > 0.4 && Math.random() <= 0.6) {
        //     this.initCircle(e.stageX, Global.stage.stageHeight - e.stageY);
        // } else if (Math.random() > 0.6 && Math.random() <= 0.8) {
        //     this.initParticle(e.stageX, Global.stage.stageHeight - e.stageY);
        // } else if (Math.random() > 0.8) {
        //     this.initCapsule(e.stageX, Global.stage.stageHeight - e.stageY);
        // }
        this.initCapsule(e.stageX, Global.stage.stageHeight - e.stageY);
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