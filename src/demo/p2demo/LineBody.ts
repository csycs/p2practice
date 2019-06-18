class LineBody extends BaseClass {

    private _world: p2.World;
    private _lineBody: p2.Body;
    private _planeBody: p2.Body;
    public init() {
        this.initWorld();
        this.initPlane();
        this.initBox();
        this.initLine(Global.stage.stageWidth / 2, Global.stage.stageHeight * 0.6);
        // this.initDebug();

        Global.main.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchHandler, this);
    }

    private initWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 9.81];
    }

    private initPlane() {
        let planeShape = new p2.Plane();
        this._planeBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, Global.stage.stageHeight * 0.9]
        });

        this._planeBody.angle = Math.PI;
        let planeDisplay = EngineControl.getInstance().drawPlane(0x3500ff, Global.stage.stageWidth, 30);
        this._planeBody.displays = [planeDisplay];
        Global.main.addChild(planeDisplay);

        this._planeBody.addShape(planeShape);
        this._world.addBody(this._planeBody);
    }

    private _boxBody: p2.Body;
    private initBox() {
        let boxShape = new p2.Box({ width: 80, height: 30 });
        this._boxBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight * 0.6],
            angularVelocity: 1
        });

        let boxDisplay = EngineControl.getInstance().createBitmapByName("rect_png");
        this._boxBody.displays = [boxDisplay];
        boxDisplay.width = (<p2.Box>boxShape).width;
        boxDisplay.height = (<p2.Box>boxShape).height;
        boxDisplay.anchorOffsetX = boxDisplay.width / 2;
        boxDisplay.anchorOffsetY = boxDisplay.height / 2;
        Global.main.addChild(boxDisplay);

        this._boxBody.addShape(boxShape);
        this._world.addBody(this._boxBody);
    }

    private initLine(x, y) {
        let lineShape = new p2.Line({ length: 100 });
        this._lineBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, y]
        });

        let aPoint = [-lineShape.length / 2, 100];
        let bPoint = [lineShape.length / 2, 100];

        let lineDisplay = this.drawLine(aPoint, bPoint);
        this._lineBody.displays = [lineDisplay];
        lineDisplay.anchorOffsetX = lineDisplay.width / 2;
        lineDisplay.anchorOffsetY = lineDisplay.height / 2;
        Global.main.addChild(lineDisplay);

        this._planeBody.addShape(lineShape);
        this._world.addBody(this._lineBody);
    }

    private debugDraw: simpleP2DebugDraw;
    private initDebug() {
        this.debugDraw = new simpleP2DebugDraw(this._world);
        let sprite = new egret.Sprite();
        this.debugDraw.setSprite(sprite);
        Global.main.addChild(sprite);
    }

    private onTouchHandler(e: egret.TouchEvent) {
        let x = Math.floor(e.stageX);
        let y = Math.floor(e.stageY);
        let ran = Math.random();
        if (ran < 0.5) {
            this.initBox();
        } else {
            this.initLine(x, y);
        }
    }

    private update() {
        this._world.step(1 / 30);
        // this.debugDraw.drawDebug();
        let l = this._world.bodies.length;
        for (let i = 0; i < l; i++) {
            let body = this._world.bodies[i];
            let display = body.displays[0];
            if (display) {
                display.x = body.position[0];
                display.y = body.position[1];
                display.rotation = body.angle * 180 / Math.PI;
                if (body.sleepState === p2.Body.SLEEPING) {
                    display.alpha = 0.5;
                } else {
                    display.alpha = 1;
                }
            }
        }
    }

    private drawLine(a1: Array<number>, b1: Array<number>) {
        let shape = new egret.Shape();
        shape.graphics.clear();
        shape.graphics.lineStyle(2, 0xff0000);
        shape.graphics.moveTo(b1[0], b1[1]);
        shape.graphics.lineTo(a1[0], a1[1]);
        shape.graphics.endFill();
        return shape;
    }
}