class RayRefractBody extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _boxBody1: p2.Body;
    private _boxBody2: p2.Body;
    private _debugDraw: DebugDraw;
    //空气折射率
    private _airIndex: number = 1;
    //刚体折射率
    private _shapeIndex: number = 1.5;
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this.createPlane();
        this.createBox1();
        this.createBox2();
        this.createRefractRay();
        this.createMouseControl();
        this.createDebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
    }

    private createWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, 0];
    }

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

    private createBox1() {
        let boxShape: p2.Box = new p2.Box({ width: 60, height: 300 });
        this._boxBody1 = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth / 2, Global.stage.stageHeight * 0.5]
        });
        this._boxBody1.angle = -0.5;
        this._boxBody1.addShape(boxShape);
        this._world.addBody(this._boxBody1);
    }

    private createBox2() {
        let boxShape: p2.Box = new p2.Box({ width: 300, height: 60 });
        this._boxBody2 = new p2.Body({
            mass: 1,
            position: [Global.stage.stageWidth * 0.8, Global.stage.stageHeight * 0.8]
        });
        this._boxBody2.addShape(boxShape);
        this._world.addBody(this._boxBody2);
    }

    private createMouseControl() {
        let mouseControl = new MouseControl(this._world);
        mouseControl.startMouseSearch();
    }

    private _ray: p2.Ray;
    private _result: p2.RaycastResult;
    private _hitPoint: number[];
    private createRefractRay() {
        this._ray = new p2.Ray({
            mode: p2.Ray.CLOSEST
        });
        this._result = new p2.RaycastResult();
        this._hitPoint = p2.vec2.create();
    }

    private drawRefractRays() {
        let hits = 0;
        //确定射线的位置
        this._ray.from[0] = Global.stage.stageWidth * 0.1;
        this._ray.from[1] = Global.stage.stageHeight * 0.1;
        this._ray.to[0] = Global.stage.stageWidth * 0.9;
        this._ray.to[1] = Global.stage.stageHeight * 0.9;
        //更新射线
        this._ray.update();
        //射线是否击中刚体
        while (this._world.raycast(this._result, this._ray) && hits++ < 10) {
            //射线撞击到刚体时的位置,画出到接触点的射线
            this._result.getHitPoint(this._hitPoint, this._ray);
            this._debugDraw.drawRay(this._ray.from, this._hitPoint);
            //将接触点赋给射线的起始点，即以接触点开始作为起点，绘制接下来可能的线段
            p2.vec2.copy(this._ray.from, this._hitPoint);
            //射线起始点改变，需要更新射线
            this._ray.update();
            //折射的实现过程
            this.refract(this._ray.direction, this._ray.direction, this._result.normal, this._airIndex, this._shapeIndex);

            this._ray.from[0] += this._ray.direction[0] * 0.001;
            this._ray.from[1] += this._ray.direction[1] * 0.001;
            this._ray.to[0] = this._ray.from[0] + this._ray.direction[0] * 1000;
            this._ray.to[1] = this._ray.from[1] + this._ray.direction[1] * 1000;

            this._result.reset();
        }
        this._debugDraw.drawRay(this._ray.from, this._ray.to);
    }

    private refract(out, direction, normal, airIndex, shapeIndex) {
        //入射角
        let inAngle;
        //出射角
        let outAngle;
        //计算射线的方向向量与接触点法线向量的点积
        let dot = p2.vec2.dot(normal, direction);
        //拿到接触点的切线，与接触点法线互相垂直
        let tangent = p2.vec2.fromValues(normal[0], normal[1]);
        p2.vec2.rotate(tangent, tangent, -Math.PI / 2);
        //计算射线的方向向量与接触点切线向量的点积
        let side = p2.vec2.dot(tangent, direction);
        //如果射线的方向向量与接触点法线向量之间的点积小于0,则可说明射线是从外界射入刚体
        if (dot < 0) {
            //射线方向向量与接触点法线向量之间的点积
            dot = p2.vec2.dot(normal, direction);
            //计算射线方向向量与接触点法线向量的夹角,即入射角
            inAngle = Math.acos(dot);
            //将接触点的法线向量调转方向
            p2.vec2.scale(normal, normal, -1);
            //计算出射角的 sin 值
            let sinOutAngle = airIndex / shapeIndex * Math.sin(inAngle);
            //如果出射角的sin值小于等于1
            if (sinOutAngle <= 1) {
                //计算出射角
                outAngle = Math.asin(sinOutAngle);
                //旋转射线法线的方向
                p2.vec2.rotate(out, normal, outAngle * (side < 0 ? -1 : 1))
            } else {
                //反射
                p2.vec2.reflect(out, direction, normal);
            }
        } else {
            //如果射线的方向向量与接触点法线向量之间的点积大于0,则可说明射线是从刚体出射入外界
            //计算射线方向向量与接触点法线向量之间的点积
            dot = p2.vec2.dot(normal, direction);
            //计算射线方向向量与接触点法线向量之间的夹角，即入射角
            inAngle = Math.acos(dot);
            //计算从刚体射出外界时的出射角的sin值
            let sinOutAngle = shapeIndex / airIndex * Math.sin(inAngle);
            if (sinOutAngle <= 1) {
                //计算得出出射角
                outAngle = Math.asin(sinOutAngle);
                //旋转接触点法线的方向
                p2.vec2.rotate(out, normal, outAngle * (side < 0 ? 1 : -1));
            } else {
                p2.vec2.reflect(out, direction, normal);
            }
        }
    }

    private createDebugDraw() {
        let sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    private update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        this._debugDraw.drawDebug();
        this.drawRefractRays();
    }
}