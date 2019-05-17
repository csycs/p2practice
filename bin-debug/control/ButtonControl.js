var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ButtonControl = (function () {
    function ButtonControl(className, y) {
        this._className = className;
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
    };
    ButtonControl.prototype.onButtonTouchBeginHandler = function (e) {
        e.stopPropagation();
        this._className.getInstance().init();
    };
    return ButtonControl;
}());
__reflect(ButtonControl.prototype, "ButtonControl");
