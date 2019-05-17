class ButtonControl {
    private _className: any;
    private _y: any;
    constructor(className, y) {
       this._className = className;
       this._y = y;
    }

    public init() {
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x705628);
        shape.graphics.drawRect(0, 0, 80, 30);
        shape.graphics.endFill();
        shape.x = 100;
        shape.y = this._y;
        Global.main.addChild(shape);
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonTouchBeginHandler, this);
    }

    private onButtonTouchBeginHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        this._className.getInstance().init();
    }
}