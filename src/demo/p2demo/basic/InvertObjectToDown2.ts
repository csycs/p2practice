/**
 * 上一个示例为没有处理坐标的情况下 倒置的世界
 * 本例 对刚体的 y 值取负， 角度取负，实现重力向下的模拟
 * TODO即为改动的地方
 */
class InvertObjectToDown2 extends BaseClass {

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

        let planeShape = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC
        });
        this._planeBody.displays = [];
        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private onClickHandler(e: egret.TouchEvent) {
        let stageX = Math.floor(e.stageX / this._factor);

        //TODO 用舞台的高度 - 点击屏幕的位置 以达到坐标翻转的效果
        let stageY = (Global.stage.stageHeight - Math.floor(e.stageY)) / this._factor;
        //TODO 用舞台的高度 - 点击屏幕的位置 以达到坐标翻转的效果

        if (Math.random() > 0.5) {
            let boxShape = new p2.Box({ width: 1.5, height: 1 });
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
            let circleShape = new p2.Circle();
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

                //TODO 用舞台的高度 - 刚体的位置 以达到坐标翻转的效果 同时对角度也做相应处理
                display.y = Global.stage.stageHeight - body.position[1] * this._factor;
                display.rotation = 360 - body.angle * 180 / Math.PI;
                //TODO 用舞台的高度 - 刚体的位置 以达到坐标翻转的效果 同时对角度也做相应处理

                if (body.sleepState === p2.Body.SLEEPING) {
                    display.alpha = 0.5;
                } else {
                    display.alpha = 1;
                }
            }
        }
    }
}