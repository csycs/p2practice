class DebugDrawTest extends BaseClass {
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

    private _circleBody: p2.Body;
    private createCircle(x, y) {
        let circleShape: p2.Circle = new p2.Circle({ radius: 30 });
        this._circleBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            position: [x, y]
        });
        this._circleBody.addShape(circleShape);
        this._world.addBody(this._circleBody);
    }

    private _boxBody: p2.Body;
    private createBox(x, y) {
        let boxShape: p2.Box = new p2.Box({ width: 80, height: 30 });
        this._boxBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private _lineBody: p2.Body;
    private createLine(x, y) {
        let lineShape: p2.Line = new p2.Line({ length: 80 });
        this._lineBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._lineBody.addShape(lineShape);
        this._world.addBody(this._lineBody);
    }

    private _particleBody: p2.Body;
    private createParticle(x, y) {
        let particleShape: p2.Particle = new p2.Particle();
        this._particleBody = new p2.Body({
            mass: 1,
            position: [x, y]
        });
        this._particleBody.addShape(particleShape);
        this._world.addBody(this._particleBody);
    }

    private _capsuleBody: p2.Body;
    private createCapsule(x, y) {
        let capsuleShape: p2.Shape = new p2.Capsule({ length: 80, radius: 20 });
        this._capsuleBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._capsuleBody.addShape(capsuleShape);
        this._world.addBody(this._capsuleBody);
    }

    private onClick(e: egret.TouchEvent) {
        let random = Math.random();
        if (random <= 0.2) {
            this.createCircle(e.stageX, e.stageY);
        } else if (random > 0.2 && random <= 0.4) {
            this.createBox(e.stageX, e.stageY);
        } else if (random > 0.4 && random <= 0.6) {
            this.createParticle(e.stageX, e.stageY);
        } else if (random > 0.6 && random < 0.8) {
            this.createLine(e.stageX, e.stageY);
        } else if (random > 0.8) {
            this.createCapsule(e.stageX, e.stageY);
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