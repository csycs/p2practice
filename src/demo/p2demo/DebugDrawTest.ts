class DebugDrawTest extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _boxBody: p2.Body;
    private _circleBody: p2.Body;
    private _particleBody: p2.Body;
    private _lineBody: p2.Body;
    private _capsuleBody: p2.Body;
    private _factor: number = 50;
    private _debugDraw: DebugDraw;
    constructor() {
        super();
    }

    public init() {
        this.createScene();
        this.createDebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapHandler, this);
    }

    private createScene() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];

        let planeShape: p2.Plane = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, Global.stage.stageHeight * 0.9 / this._factor]
        });
        this._planeBody.angle = Math.PI;
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private createBox(x, y) {
        let boxShape: p2.Box = new p2.Box({ width: 3, height: 1.3 });
        this._boxBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            type: p2.Body.DYNAMIC,
            position: [x, y]
        });
        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private createCircle(x, y) {
        let circleShape: p2.Circle = new p2.Circle({ radius: 0.8 });
        this._circleBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            position: [x, y]
        });
        this._circleBody.addShape(circleShape);
        this._world.addBody(this._circleBody);
    }

    private createParticle(x, y) {
        let particleShape: p2.Particle = new p2.Particle();
        this._particleBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._particleBody.addShape(particleShape);
        this._world.addBody(this._particleBody);
    }

    private createLine(x, y) {
        let lineShape: p2.Line = new p2.Line({ length: 1.5 });
        this._lineBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._lineBody.addShape(lineShape);
        this._world.addBody(this._lineBody);
    }

    private createCapsule(x, y) {
        let capsuleShape: p2.Capsule = new p2.Capsule({ length: 2, radius: 0.2 });
        this._capsuleBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });
        this._capsuleBody.addShape(capsuleShape);
        this._world.addBody(this._capsuleBody);
    }

    private createDebugDraw() {
        this._debugDraw = new DebugDraw(this._world);
    }

    private onTouchTapHandler(e: egret.TouchEvent) {
        let stageX = this._debugDraw.transform_disValue_to_p2Value(e.stageX);
        let stageY = this._debugDraw.transform_disValue_to_p2Value(e.stageY);
        let random = Math.random();
        if (random <= 0.2) {
            this.createCircle(stageX, stageY);
        } else if (random > 0.2 && random <= 0.4) {
            this.createBox(stageX, stageY);
        } else if (random > 0.4 && random <= 0.6) {
            this.createParticle(stageX, stageY);
        } else if (random > 0.6 && random < 0.8) {
            this.createLine(stageX, stageY);
        } 
        // else if (random > 0.8) {
        //     this.createCapsule(stageX, stageY);
        // }
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        this._debugDraw.drawDebug();
    }
}