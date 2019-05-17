var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var EngineControl = (function (_super) {
    __extends(EngineControl, _super);
    function EngineControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    EngineControl.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 为地面绘制外形
     * @param color
     * @param position
     */
    EngineControl.prototype.drawPlane = function (color, width, height) {
        var plane = new egret.Shape();
        plane.graphics.beginFill(color);
        plane.graphics.drawRect(0, 0, width, height);
        plane.graphics.endFill();
        return plane;
    };
    /**
     * 为矩形绘制外形
     * @param color
     * @param position
     */
    EngineControl.prototype.drawBox = function (color, width, height) {
        var box = new egret.Shape();
        box.graphics.beginFill(color);
        box.graphics.drawRect(0, 0, width, height);
        box.graphics.endFill();
        return box;
    };
    EngineControl.prototype.drawCircle = function (color, radius) {
        var circle = new egret.Shape();
        circle.graphics.beginFill(color);
        circle.graphics.drawCircle(0, 0, radius);
        circle.graphics.endFill();
        return circle;
    };
    return EngineControl;
}(BaseClass));
__reflect(EngineControl.prototype, "EngineControl");
