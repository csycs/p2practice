/**
 * 浮力的示例 还有一些没有发现的小问题
 * 在对复合刚体进行贴图的时候，要注意对每个形状的位置进行转换，然后再去更新对应贴图的位置
 */
class Buoyancy extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _circleBody: p2.Body;
    constructor() {
        super();
        egret.Ticker.getInstance().register(this.update, this);
    }

    public init() {
        this.initWorld();
        this.initPlane();
        this.initCircle();
    }

    private initWorld() {
        this._world = new p2.World({
            gravity: [0, 10],
        });
        this._world.sleepMode = p2.World.BODY_SLEEPING;
    }

    private initPlane() {
        let planeShape: p2.Plane = new p2.Plane();
        this._planeBody = new p2.Body({
            position: [0, Global.stage.stageHeight * 0.8 / 50],
            type: p2.Body.STATIC,
            collisionResponse: false
        });
        this._planeBody.addShape(planeShape);
        this._planeBody.angle = Math.PI;
        this._world.addBody(this._planeBody);

        let bmp: egret.Bitmap = EngineControl.getInstance().createBitmapByName("rect_png");
        bmp.width = Global.stage.stageWidth;
        bmp.height = 200;
        bmp.x = this._planeBody.position[0] * 50;
        bmp.y = this._planeBody.position[1] * 50;
        this._planeBody.displays = [bmp];
        Global.main.addChild(bmp);
    }

    private initCircle() {
        let circleShape1: p2.Circle = new p2.Circle({ radius: 1 });
        let circleShape2: p2.Circle = new p2.Circle({ radius: 1 })

        this._circleBody = new p2.Body({
            mass: 1,
            type: p2.Body.DYNAMIC,
            position: [Global.stage.stageWidth / 2 / 50, Global.stage.stageHeight / 2 / 50]
        });

        let pos1 = [], pos2 = [];
        this._circleBody.toWorldFrame(pos1, [1, 0]);
        this._circleBody.toWorldFrame(pos2, [-1, 0]);

        this._circleBody.addShape(circleShape1, [1, 0], 0);
        this._circleBody.addShape(circleShape2, [-1, 0], 0);
        this._world.addBody(this._circleBody);

        let bmp1: egret.Bitmap = EngineControl.getInstance().createBitmapByName("circle_png");
        bmp1.width = circleShape1.radius * 2 * 50;
        bmp1.height = circleShape1.radius * 2 * 50;
        bmp1.anchorOffsetX = bmp1.width / 2;
        bmp1.anchorOffsetY = bmp1.height / 2;

        bmp1.x = pos1[0] * 50;
        bmp1.y = pos1[1] * 50;

        let bmp2: egret.Bitmap = EngineControl.getInstance().createBitmapByName("circle_png");
        bmp2.width = circleShape1.radius * 2 * 50;
        bmp2.height = circleShape1.radius * 2 * 50;
        bmp2.anchorOffsetX = bmp1.width / 2;
        bmp2.anchorOffsetY = bmp1.height / 2;
        bmp2.x = pos2[0] * 50;
        bmp2.y = pos2[1] * 50;

        this._circleBody.displays = [bmp1, bmp2];
        Global.main.addChild(bmp1);
        Global.main.addChild(bmp2);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        // 世界中的刚体个数
        let l: number = this._world.bodies.length;
        for (let i = 0; i < l; i++) {
            // 获取每个刚体
            let body: p2.Body = this._world.bodies[i];
            // 获取每个刚体的display
            let disL = body.displays.length;
            for (let i = 0; i < disL; i++) {
                let display: egret.DisplayObject = body.displays[i];
                if (display) {
                    let shape: p2.Shape = body.shapes[0];
                    if (shape instanceof p2.Plane) {
                        display.x = body.position[0] * 50;
                        display.y = body.position[1] * 50;
                        display.rotation = display.rotation; 
                    } else if (shape instanceof p2.Circle) {
                        let pos1 = [], pos2 = [];
                        this._circleBody.toWorldFrame(pos1, [1, 0]);
                        this._circleBody.toWorldFrame(pos2, [-1, 0]);
                        body.displays[0].x = pos1[0] * 50;
                        body.displays[0].y = pos1[1] * 50;
                        body.displays[0].rotation = body.shapes[0].angle * 180 / Math.PI;

                        body.displays[1].x = pos2[0] * 50;
                        body.displays[1].y = pos2[1] * 50;
                        body.displays[1].rotation = body.shapes[1].angle * 180 / Math.PI;
                    }
                }
                if (body.sleepState === p2.Body.SLEEPING) {
                    display.alpha = 1;
                } else {
                    display.alpha = 0.5;
                }
            }
        }

        this.applyAABBBuoyancyForces(this._circleBody, this._planeBody.position, this.k, this.c);
    }

    private k: number = 5; // 每浸入水中一个体积产生的向上的力
    private c = 0.8; // 黏性 黏度
    private shapePosition = [0, 0]; // 保存小球坐标的数组
    private shapeAngle = 0; // 小球的角度值
    private aabb = new p2.AABB(); // aabb包围盒
    private centerOfBouyancy = [0, 0]; // 浮力中心
    private liftForce = [0, 0]; // 向上的力
    private viscousForce = [0, 0]; // 黏性力
    private v = [0, 0];
    private applyAABBBuoyancyForces(body, planePosition, k, c) {

        for (let i = 0; i < body.shapes.length; i++) {

            // 获取小球的形状，这里小球只有一个circle
            let shape = body.shapes[i];

            // 将小球的本地坐标转换为世界坐标
            body.vectorToWorldFrame(this.shapePosition, shape.position);
            p2.vec2.add(this.shapePosition, this.shapePosition, body.position);
            this.shapeAngle = shape.angle + body.angle;
            // this.shapeAngle = body.angle;

            // 获取小球形状在世界中的AABB包围盒
            shape.computeAABB(this.aabb, this.shapePosition, this.shapeAngle);

            // 小球在水面下的部分
            let areaUnderWater;
            // 小球包围盒上边界的y值 小于 地板的y值
            if (this.aabb.upperBound[1] < planePosition[1]) {
                // 此时可以认为小球完全浸入水中,将小球的位置赋给浮力产生的位置
                p2.vec2.copy(this.centerOfBouyancy, this.shapePosition);
                // 此时小球在水下的部分，就是小球形状的面积
                areaUnderWater = shape.area;
            } else if (this.aabb.lowerBound[1] < planePosition[1]) {
                // 小球包围盒下边界的y值 小于 地板的y值
                // 此时认为小球为部分浸入水面
                // 获取宽，即小球包围盒在水面下部分的宽
                let width = this.aabb.upperBound[0] - this.aabb.lowerBound[0];
                // 获取高，即小球包围盒在水面下部分的高
                let height = 0 - this.aabb.lowerBound[1];
                // 计算小球包围盒在水面下的面积
                areaUnderWater = width * height;
                // 设置产生浮力的中心位置
                p2.vec2.set(this.centerOfBouyancy, this.aabb.lowerBound[0] + width / 2, this.aabb.lowerBound[1] + height / 2);
            }

            // 计算向上的力
            p2.vec2.subtract(this.liftForce, planePosition, this.centerOfBouyancy);
            // 根据在水下部分的多少计算向上的力
            p2.vec2.scale(this.liftForce, this.liftForce, areaUnderWater * k);
            // 横向的力置为0
            this.liftForce[0] = 0;

            // 将浮力中心置于小球
            p2.vec2.subtract(this.centerOfBouyancy, this.centerOfBouyancy, body.position);

            //黏性力
            body.getVelocityAtPoint(this.v, this.centerOfBouyancy);
            p2.vec2.scale(this.viscousForce, this.v, -c);

            // 将力作用于刚体
            body.applyForce(this.viscousForce, this.centerOfBouyancy);
            body.applyForce(this.liftForce, this.centerOfBouyancy);
        }
    }
}