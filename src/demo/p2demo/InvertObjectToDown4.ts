/**
 * 
 */
class InvertObjectToDown4 extends BaseClass {

    public init() {

        this.createGameScene();

        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    }

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _objectBody: p2.Body;
    private _objectDisplay: egret.DisplayObjectContainer;
    private _factor: number = 50;
    private createGameScene() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];

        let planeShape = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, Global.stage.stageHeight * 0.8 / this._factor]
        });
        this._planeBody.angle = Math.PI;
        let display = EngineControl.getInstance().createBitmapByName("rect_png");
        this._planeBody.displays = [display];
        display.width = Global.stage.stageWidth;
        display.height = 100;
        display.x = this._planeBody.position[0] * this._factor;
        display.y = this._planeBody.position[1] * this._factor;
        Global.main.addChild(display);
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private onClickHandler(e: egret.TouchEvent) {
        let stageX = Math.floor(e.stageX / this._factor);
        let stageY = Math.floor(e.stageY / this._factor);
        if (Math.random() > 0.5) {
            let boxShape = new p2.Box({ width: 3, height: 1 });
            this._objectBody = new p2.Body({
                mass: 1,
                position: [stageX, stageY],
                angularVelocity: 1
            });
            this._objectBody.addShape(boxShape);
            this._world.addBody(this._objectBody);

            this._objectDisplay = EngineControl.getInstance().createBitmapByName("rect_png");
            this._objectDisplay.width = (<p2.Box>boxShape).width * this._factor;
            this._objectDisplay.height = (<p2.Box>boxShape).height * this._factor;
        } else {
            let circleShape = new p2.Circle({ radius: 1 });
            this._objectBody = new p2.Body({
                mass: 1,
                position: [stageX, stageY]
            });
            this._objectBody.addShape(circleShape);
            this._world.addBody(this._objectBody);

            this._objectDisplay = EngineControl.getInstance().createBitmapByName("circle_png");
            this._objectDisplay.width = (<p2.Circle>circleShape).radius * 2 * this._factor;
            this._objectDisplay.height = (<p2.Circle>circleShape).radius * 2 * this._factor;
        }

        this._objectDisplay.x = this._objectBody.position[0] * this._factor;
        this._objectDisplay.y = this._objectBody.position[1] * this._factor;
        this._objectDisplay.anchorOffsetX = this._objectDisplay.width / 2;
        this._objectDisplay.anchorOffsetY = this._objectDisplay.height / 2;

        //绑定刚体和显示皮肤
        this._objectBody.displays = [this._objectDisplay];
        Global.main.addChild(this._objectDisplay);//把皮肤添加到显示世界
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        let length = this._world.bodies.length;
        for (let i = 0; i < length; i++) {
            let body = this._world.bodies[i];
            let display = body.displays[0];
            if (display) {
                display.x = body.position[0] * this._factor;
                display.y = body.position[1] * this._factor;
                let shape = body.shapes[0];
                if (shape instanceof p2.Plane) {
                    display.rotation = display.rotation;
                } else {
                    display.rotation = body.angle * 180 / Math.PI;
                }
                if (body.sleepState === p2.Body.SLEEPING) {
                    display.alpha = 0.5;
                } else {
                    display.alpha = 1;
                }
            }
        }
    }
}