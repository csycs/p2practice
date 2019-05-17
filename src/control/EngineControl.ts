class EngineControl extends BaseClass {
    
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 为地面绘制外形
     * @param color 
     * @param position 
     */
    public drawPlane(color, width, height) {
        let plane: egret.Shape = new egret.Shape();
        plane.graphics.beginFill(color);
        plane.graphics.drawRect(0, 0, width, height);
        plane.graphics.endFill();
        return plane;
    }

    /**
     * 为矩形绘制外形
     * @param color 
     * @param position 
     */
    public drawBox(color, width, height) {
        let box: egret.Shape = new egret.Shape();
        box.graphics.beginFill(color);
        box.graphics.drawRect(0, 0, width, height);
        box.graphics.endFill();
        return box;
    }

    public drawCircle(color, radius) {
        let circle: egret.Shape = new egret.Shape();
        circle.graphics.beginFill(color);
        circle.graphics.drawCircle(0, 0, radius);
        circle.graphics.endFill();
        return circle;
    }
}