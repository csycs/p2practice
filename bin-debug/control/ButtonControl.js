var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ButtonControl = (function () {
    function ButtonControl(className, y, tips) {
        this._className = className;
        this._tips = tips;
        this._y = y;
    }
    ButtonControl.prototype.init = function () {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x705628);
        shape.graphics.drawRect(0, 0, 80, 30);
        shape.graphics.endFill();
        shape.x = 100;
        shape.y = this._y;
        Global.main.addChild(shape);
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonTouchBeginHandler, this);
        this.initOriginalTips();
        this.initTipsText(shape.x, shape.y);
    };
    ButtonControl.prototype.onButtonTouchBeginHandler = function (e) {
        e.stopPropagation();
        this._className.getInstance().init();
    };
    ButtonControl.prototype.initOriginalTips = function () {
        this._originalTips = new egret.TextField();
        this._originalTips.text = '点击右侧按钮，可分别进入不同的演示程序';
        this._originalTips.width = 20;
        this._originalTips.height = 300;
        this._originalTips.size = 15;
        this._originalTips.x = 30;
        this._originalTips.verticalAlign = egret.VerticalAlign.TOP;
        Global.main.addChild(this._originalTips);
    };
    ButtonControl.prototype.initTipsText = function (x, y) {
        this._buttonTip = new egret.TextField();
        this._buttonTip.text = this._tips;
        this._buttonTip.size = 10;
        this._buttonTip.x = x;
        this._buttonTip.y = y + 10;
        Global.main.addChild(this._buttonTip);
    };
    return ButtonControl;
}());
__reflect(ButtonControl.prototype, "ButtonControl");
