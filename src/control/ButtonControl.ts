class ButtonControl {
    private _originalTips: egret.TextField;
    private _buttonTip: egret.TextField;
    private _className: any;
    private _tips: string;
    private _x: any;
    private _y: any;
    constructor(className, x, y, tips) {
        this._className = className;
        this._tips = tips;
        this._x = x;
        this._y = y;
    }

    public init() {
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x705628);
        shape.graphics.drawRect(0, 0, 80, 30);
        shape.graphics.endFill();
        shape.x = this._x;
        shape.y = this._y;
        Global.main.addChild(shape);
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonTouchBeginHandler, this);

        this.initOriginalTips();
        this.initTipsText(shape.x, shape.y);
    }

    private onButtonTouchBeginHandler(e: egret.TouchEvent) {
        e.stopPropagation();
        this._className.getInstance().init();
    }

    private initOriginalTips() {
        this._originalTips = new egret.TextField();
        this._originalTips.text = '点击右侧按钮，可分别进入不同的演示程序';
        this._originalTips.width = 20;
        this._originalTips.height = 300;
        this._originalTips.size = 15;
        this._originalTips.x = 30;
        this._originalTips.verticalAlign = egret.VerticalAlign.TOP;
        Global.main.addChild(this._originalTips);
    }

    private initTipsText(x, y) {
        this._buttonTip = new egret.TextField();
        this._buttonTip.text = this._tips;
        this._buttonTip.size = 10;
        this._buttonTip.x = x;
        this._buttonTip.y = y + 10;
        Global.main.addChild(this._buttonTip);
    }
}