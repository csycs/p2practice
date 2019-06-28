/**
 * 高度地形还有问题，初始化出来之后，高度地形是反方向的，做了额外的处理才实现
 * 这个地方需要排查一下
 */
class PolygonShape extends BaseClass {

    private _world: p2.World;
    private _planeBody: p2.Body;
    private _heightFieldBody: p2.Body;
    private _polygonBody: p2.Body;
    private _debugDraw: DebugDraw;
    private _polygonMaterial: p2.Material;
    private _heightsFieldMaterial: p2.Material;
    constructor() {
        super();
    }

    public init() {
        this.createWorld();
        this._polygonMaterial = new p2.Material(1000);
        this._heightsFieldMaterial = new p2.Material(1001);
        this.createHeightField();
        this.createPlane();
        this.createDebugDraw();
        egret.Ticker.getInstance().register(this.update, this);
        Global.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

        Global.main.scaleY = -1;
        Global.main.y = Global.stage.stageHeight;
    }

    private createWorld() {
        this._world = new p2.World();
        this._world.sleepMode = p2.World.BODY_SLEEPING;
        this._world.gravity = [0, -9.81];
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

    private createHeightField() {
        let heights: Array<number> = [300, 330, 320, 290, 310, 350, 340, 360, 370, 350, 380];
        let heightFieldShape: p2.Heightfield = new p2.Heightfield({ heights: heights, elementWidth: 100 });
        this._heightFieldBody = new p2.Body({
            position: [200, 0]
        });
        heightFieldShape.material = this._heightsFieldMaterial;
        this._heightFieldBody.addShape(heightFieldShape);
        this._world.addBody(this._heightFieldBody);

        let contactMaterial1: p2.ContactMaterial = new p2.ContactMaterial(
            this._heightsFieldMaterial,
            this._polygonMaterial,
            <p2.ContactMaterialOptions>{ stiffness: 100, restitution: 0.0, friction: 20 }
        );
        this._world.addContactMaterial(contactMaterial1);
    }

    private createConvex_triangle(x, y) {
        let vertices = [[-30, -40], [30, -40], [0, 40]];
        let convexShape1: p2.Convex = new p2.Convex({ vertices: vertices });
        this._polygonBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, Global.stage.stageHeight - y]
        });
        convexShape1.material = this._polygonMaterial;
        this._polygonBody.addShape(convexShape1);
        this._world.addBody(this._polygonBody);
    }

    private createConvex_polygon(x, y) {
        let vertices = [[-30, -40], [30, -40], [40, 0], [50, 20], [30, 40], [-30, 30], [-40, 20], [-40, 0]];
        let convexShape: p2.Convex = new p2.Convex({ vertices: vertices });
        this._polygonBody = new p2.Body({
            mass: 1,
            angularVelocity: 1,
            position: [x, Global.stage.stageHeight - y]
        });
        convexShape.material = this._polygonMaterial;
        this._polygonBody.addShape(convexShape);
        this._world.addBody(this._polygonBody);
    }

    private onClick(e: egret.TouchEvent) {
        let random = Math.random();
        if (random <= 0.5) {
            this.createConvex_triangle(e.stageX, e.stageY);
        } else {
            this.createConvex_polygon(e.stageX, e.stageY);
        }
        // this.test(e.stageX, e.stageY)
    }

    private test(x, y) {
        let shape = new p2.Circle({ radius: 30 });
        let shapeBody = new p2.Body({
            mass: 1,
            position: [x, y]
        })
        shape.material = this._polygonMaterial;
        shapeBody.addShape(shape);
        this._world.addBody(shapeBody);
    }

    private createDebugDraw() {
        let sprite: egret.Sprite = new egret.Sprite();
        Global.main.addChild(sprite);
        this._debugDraw = new DebugDraw(this._world, sprite);
    }

    public update(dt) {
        if (dt < 10 || dt > 1000) return;
        this._world.step(dt / 1000);
        // this._world.step(60 / 1000);
        this._debugDraw.drawDebug();
    }
}