
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

        let clickToShowShape = new ButtonControl(ClickToShowShape, 10, "点击屏幕出现物体");
        clickToShowShape.init();

        let invertObject = new ButtonControl(InvertObject, 50, "初始世界，重力朝上");
        invertObject.init();

        let invertObjectToDown1 = new ButtonControl(InvertObjectToDown1, 90, "翻转容器，实现物体下落");
        invertObjectToDown1.init();

        let invertObjectToDown2 = new ButtonControl(InvertObjectToDown2, 130, "屏幕高度-刚体y,实现物体下落");
        invertObjectToDown2.init();

        let invertObjectToDown3 = new ButtonControl(InvertObjectToDown3, 170, "y值，角度取负，实现物体下落");
        invertObjectToDown3.init();

        let personalDebugDraw = new ButtonControl(PersonalDebugDraw, 210, "自己写的DebugDraw");
        personalDebugDraw.init();

        let mouseJoint = new ButtonControl(MouseJoint, 250, "鼠标拾取刚体");
        mouseJoint.init();
    }
}