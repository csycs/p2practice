class ClickToShowShape extends BaseClass {
    private world: p2.World;
    private planeShape: p2.Plane;
    private planeBody: p2.Body;
    private factor: number = 50;

    public init() {
        this.createWorld();
        this.createPlane();
        this.createOriBox();

        //执行step函数
        egret.Ticker.getInstance().register(this.update, this);
        //舞台添加点击事件，点击出现物体
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
    }

    private createWorld() {
        this.world = new p2.World();
        //设置一定时间后进入休眠状态，提升性能
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        //设置重力
        this.world.gravity = [0, 9.81];
    }

    private createPlane() {
        //创建一个shape形状
        this.planeShape = new p2.Plane();
        //创建一个body刚体
        this.planeBody = new p2.Body({
            //刚体类型
            type: p2.Body.STATIC,
            //刚体位置
            position: [0, Global.stage.stageHeight * 0.9 / this.factor]
        });
        //egret的坐标轴与p2的坐标轴相反，所以把地面反转180度
        this.planeBody.angle = Math.PI;
        //显示对象的数组，用作给刚体贴图
        this.planeBody.displays = [];
        //将形状加入刚体之中
        this.planeBody.addShape(this.planeShape);
        //将刚体加入到舞台之上
        this.world.addBody(this.planeBody);
    }

    private _oriBoxBody: p2.Body;
    private createOriBox() {
        //创建box shape
        let oriBoxShape: p2.Shape = new p2.Box({ width: 1.5, height: 1 });
        //创建box 刚体
        this._oriBoxBody = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth / 2 / this.factor, Global.stage.stageHeight * 0.3 / this.factor],
            angularVelocity: 1
        });
        //形状加入刚体
        this._oriBoxBody.addShape(oriBoxShape);
        //刚体加入世界
        this.world.addBody(this._oriBoxBody);
        //给刚体创建贴图
        let oriBoxDisplay = EngineControl.getInstance().createBitmapByName("rect_png");
        //设置贴图宽高与刚体形状一致
        oriBoxDisplay.width = (<p2.Box>oriBoxShape).width * this.factor;
        oriBoxDisplay.height = (<p2.Box>oriBoxShape).height * this.factor;
        //位置
        oriBoxDisplay.x = this._oriBoxBody.position[0];
        oriBoxDisplay.y = this._oriBoxBody.position[1];
        //贴图
        this._oriBoxBody.displays = [oriBoxDisplay];
        //处理egret贴图的锚点
        oriBoxDisplay.anchorOffsetX = oriBoxDisplay.width / 2;
        oriBoxDisplay.anchorOffsetY = oriBoxDisplay.height / 2;
        //贴图，即显示对象加入舞台
        Global.main.addChild(oriBoxDisplay);
    }

    private shapeBody: p2.Body;
    //贴图显示对象
    private display: egret.DisplayObject;
    private onButtonClick(e: egret.TouchEvent) {
        e.stopPropagation();
        if (Math.random() > 0.5) {
            //添加方形刚体
            var boxShape: p2.Shape = new p2.Box({ width: 1.5, height: 1 });
            this.shapeBody = new p2.Body({
                mass: 1,
                type: p2.Body.DYNAMIC,
                position: [e.stageX / this.factor, e.stageY / this.factor],
                angularVelocity: 1
            });
            this.shapeBody.addShape(boxShape);
            this.world.addBody(this.shapeBody);
            this.display = EngineControl.getInstance().createBitmapByName("rect_png");
            this.display.width = (<p2.Box>boxShape).width * this.factor;
            this.display.height = (<p2.Box>boxShape).height * this.factor;
        } else {
            //添加圆形刚体
            var circleShape: p2.Shape = new p2.Circle({ radius: 1 });
            this.shapeBody = new p2.Body({
                mass: 1,
                type: p2.Body.DYNAMIC,
                position: [e.stageX / this.factor, e.stageY / this.factor]
            });
            this.shapeBody.addShape(circleShape);
            this.world.addBody(this.shapeBody);
            this.display = EngineControl.getInstance().createBitmapByName("circle_png");
            this.display.width = (<p2.Circle>circleShape).radius * 2 * this.factor;
            this.display.height = (<p2.Circle>circleShape).radius * 2 * this.factor;
        }
        this.display.x = this.shapeBody.position[0];
        this.display.y = this.shapeBody.position[1];
        this.display.anchorOffsetX = this.display.width / 2;
        this.display.anchorOffsetY = this.display.height / 2;
        this.shapeBody.displays = [this.display];
        Global.main.addChild(this.display);
    }

    //帧事件，步函数
    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this.world.step(dt / 1000);
        //world中存放有世界里的所有body
        let l = this.world.bodies.length;
        for (let i = 0; i < l; i++) {
            let boxBody: p2.Body = this.world.bodies[i];
            //body中存放了egret贴图对象
            let box: egret.DisplayObject = boxBody.displays[0];
            if (box) {
                //将刚体的坐标和角度赋值给显示对象
                box.x = boxBody.position[0] * this.factor;
                box.y = boxBody.position[1] * this.factor;
                box.rotation = boxBody.angle * 180 / Math.PI;
                //如果刚体为睡眠状态，将图片透明度设置为0.5，否则为1
                if (boxBody.sleepState == p2.Body.SLEEPING) {
                    box.alpha = 0.5;
                } else {
                    box.alpha = 1;
                }
            }
        }
    }
}