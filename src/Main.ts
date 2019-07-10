
class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })

    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json");
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        Global.main = this;
        Global.stage = this.stage;

        let clickToShowShape = new ButtonControl(ClickToShowShape, 100, 10, "点击屏幕出现物体");
        clickToShowShape.init();

        let invertObject = new ButtonControl(InvertObject, 100, 50, "初始世界，重力朝上");
        invertObject.init();

        let invertObjectToDown1 = new ButtonControl(InvertObjectToDown1, 100, 90, "翻转容器，实现物体下落");
        invertObjectToDown1.init();

        let invertObjectToDown2 = new ButtonControl(InvertObjectToDown2, 100, 130, "屏幕高度-刚体y,实现物体下落");
        invertObjectToDown2.init();

        let invertObjectToDown3 = new ButtonControl(InvertObjectToDown3, 100, 170, "y值，角度取负，实现物体下落");
        invertObjectToDown3.init();

        let invertObjectToDown4 = new ButtonControl(InvertObjectToDown4, 100, 210, "地板角度取负，实现物体下落");
        invertObjectToDown4.init();

        let basicalShape = new ButtonControl(BasicalShape, 100, 250, "基础形状:圆,矩形,线,粒子,胶囊");
        basicalShape.init();

        let polygonShape = new ButtonControl(PolygonShape, 100, 290, "特殊形状:凸多边形,特殊地形");
        polygonShape.init();

        let p2ToWorldFrame = new ButtonControl(P2ToWorldFrame, 100, 330, "p2ToWorldFrame演示");
        p2ToWorldFrame.init();

        let mouseJoint = new ButtonControl(MouseJoint, 100, 370, "鼠标拾取刚体");
        mouseJoint.init();

        let concaveShape = new ButtonControl(ConcaveShape, 100, 410, "通过 fromPolygon 模拟凹多边形");
        concaveShape.init();

        let compoundBody = new ButtonControl(CompoundBody, 100, 450, "模拟复合刚体的实现");
        compoundBody.init();

        let rayCastToBody = new ButtonControl(RayCastToBody, 100, 490, "射线击中刚体的示例 ");
        rayCastToBody.init();

        let rayReflectBody = new ButtonControl(RayReflectBody, 100, 530, "射线击中刚体的反射示例 ");
        rayReflectBody.init();

        let rayRefractBody = new ButtonControl(RayRefractBody, 100, 570, "射线击中刚体的折射示例 ");
        rayRefractBody.init();

        let distanceConstraint = new ButtonControl(DistanceConstraint, 100, 610, "距离约束");
        distanceConstraint.init();

        let gearConstraint = new ButtonControl(GearConstraint, 100, 650, "角度约束");
        gearConstraint.init();

        let lockConstraint = new ButtonControl(LockConstraint, 260, 10, "位置旋转约束");
        lockConstraint.init();

        let prismaticConstraint = new ButtonControl(PrismaticConstraint, 260, 50, "滑块约束");
        prismaticConstraint.init();

        let revoluteConstraint = new ButtonControl(RevoluteConstraint, 260, 90, "旋转偏移约束");
        revoluteConstraint.init();

        let wheelConstraint = new ButtonControl(WheelConstraint, 260, 130, "WheelConstraint");
        wheelConstraint.init();
    }
}