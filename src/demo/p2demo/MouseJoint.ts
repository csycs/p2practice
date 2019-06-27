class MouseJoint extends BaseClass {
    constructor() {
        super();
    }

    public init() {
        this.createScene();
        this.initBottomPlane();
        this.initOriginalBox();
        this.initMouseBody();
        this.createDdebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }

    private _world: p2.World;
    private createScene() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];
    }

    private _planeBody: p2.Body;
    private initBottomPlane() {
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
    private initOriginalBox() {
        let boxShape = new p2.Box({ width: 100, height: 40 });
        this._boxBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight / 2]
        })
        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private _mouseBody: p2.Body;
    private initMouseBody() {
        let mouseShape = new p2.Box();
        this._mouseBody = new p2.Body({
            mass: 1,
            type: p2.Body.KINEMATIC
        });
        this._mouseBody.addShape(mouseShape);
        this._world.addBody(this._mouseBody);
    }

    private _mouseConstraint: p2.RevoluteConstraint;
    private onTouchBeginHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        let hitBodies = this._world.hitTest([e.stageX, e.stageY], this._world.bodies, 5);

        if (hitBodies.length) {
            let tempHitBody = hitBodies[0];
            this._mouseBody.position[0] = e.stageX;
            this._mouseBody.position[1] = e.stageY;
            this._mouseConstraint = new p2.RevoluteConstraint(this._mouseBody, tempHitBody, { worldPivot: [e.stageX, e.stageY] });
            this._mouseConstraint.collideConnected = false;

            this._world.addConstraint(this._mouseConstraint);
        }
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
    }

    private onTouchMoveHandler(e: egret.TouchEvent) {
        this._mouseBody.position[0] = e.stageX;
        this._mouseBody.position[1] = e.stageY;
    }

    private onTouchEndHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        if (this._mouseConstraint) {
            this._world.removeConstraint(this._mouseConstraint);
            this._mouseConstraint.bodyA = null;
            this._mouseConstraint.bodyB = null;
            this._mouseConstraint = null;
        }
        Global.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
        Global.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
    }

    private _debugDraw: DebugDraw;
    private createDdebugDraw() {
        let sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(60 / 1000);
        this._debugDraw.drawDebug();
    }
}