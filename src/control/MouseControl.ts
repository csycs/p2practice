/**
 * 鼠标拖拽刚体的工具
 * 在需要用到该功能的地方：
 * let mouseControl = new MouseControl(world);
 * mouseControl.startMouseSearch();
 */
class MouseControl extends BaseClass {

    private _world: p2.World;
    private _mouseBody: p2.Body;
    private _mouseConstraint: p2.RevoluteConstraint;
    constructor(world) {
        super();
        this._world = world;
        this.initMouseBody();
        this.startMouseSearch();
        this.removeMouseSearch();
    }

    public startMouseSearch() {
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }

    public removeMouseSearch() {
        Global.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
    }

    private initMouseBody() {
        let mouseShape: p2.Box = new p2.Box();
        this._mouseBody = new p2.Body({});
        this._mouseBody.addShape(mouseShape);
        this._mouseBody.displays = [];
        this._world.addBody(this._mouseBody);
    }

    private onTouchBeginHandler(e: egret.TouchEvent) {
        //首先检测鼠标点击的位置是否有刚体
        let hitBodies = this._world.hitTest([e.stageX, e.stageY], this._world.bodies, 5);
        if (hitBodies[0]) {
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
}