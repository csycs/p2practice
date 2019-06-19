# p2物理引擎与egret游戏引擎的结合使用
## 写在前面的话
**在开始阅读之前，一定要先明确如下的几个概念:**
1. p2与egret的坐标系是不同的!
   - 在p2中，坐标系原点在左下角，y轴向上，x轴向右。
   - 在egret中，坐标系原点在左上角，y轴向下，x轴向右。
2. p2的单位与egret的单位并不是一致的！
   - p2中的单位使用的并不是像素值，而是类似于m的概念。与egret中像素的换算关系为 1m = 50px。经过测试，现在应该不用进行单位的换算。
   - 不换算单位确实可以，但是如果将p2中shape的宽高设置的过大时，会严重影响渲染的速度，所以可以适当的对单位进行换算，对大的刚体，可进行单位换算，以加速渲染。
3. p2与egret的锚点位置不一样！
   - p2中图形锚点的位置处于图形的中心
   - egret中图形锚点的位置处于图形的左上角
4. 在学习p2时，一定要注意这些概念的不同导致的坐标关系的不同，在涉及到位置，角度的计算时，要做相应的转换才可以保证位置角度的完全统一。
5. p2与egret的角度并不是一套标准，需要做转换。在步函数中即可。
6. 在最新的p2.js与egret的使用测试中发现，在使用过程中，只需要将egret对象的锚点修改至中心点，即可在步函数中实时的去更新egret对象的坐标。要进行角度的更新的话，也要在步函数中进行实时的换算。
## egret 接入 p2 物理引擎
1. 到网上下载白鹭第三方库，找到physics的库文件
2. 创建项目，将physics库放入libs文件夹下
   - 注意不能放入modules，要与modules平级
3. 在egretProperties.json中配置文件信息与路径
4. 编译引擎 egret b -e
## 世界world
在物理引擎中，world就相当于一个总的容器，所有的物体都需要添加到这个物理世界之中，才能显示出来或者进行物理操作。
```
let world: p2.world = new p2.world();
//对world设置一定时间后进入休眠状态，可以大大提升性能
world.sleepMode =  p2.World.BODY_SLEEPING;
//设置重力
world.gravity = [0, 9.81];
```
**world的关键方法**
```
world.step()
```
## 刚体body
刚体是指在外力作用下，并不会发声形变，即大小形状都不会改变的物体。
```
let body: p2.body = new p2.body({
    type: ""
    position: []
});
```
## 形状shape
在物理引擎中，body是没有实际形状的，需要自己去创建形状再和body结合。例如：现在需要一个具有物理属性的圆。则需要以下几个步骤。
```
//首先创建一个刚体
let body: p2.body = new p2.body({
    type: "",
    position: []
});
//然后创建一个圆的形状
let shape: p2.circle = new p2.circle();
//将创建好的形状添加到刚体之中
body.addShape(shape);
//需要将创建好的刚体添加到物理世界world之中
world.addChild(body)
```
**在圆形刚体创建之后，此时在世界中是看不到任何东西的**
- 主要有以下两个原因：
   1. p2引擎提供的只是物理计算相关的东西，并不会去渲染刚体，所以会和类似egret等的其他引擎配合进行刚体的渲染。
   ```
   //每个刚体都会有一个displays[]属性,用来对刚体进行渲染
   //数组中可以是egret中的图或者是自己画的形状
   body.displays = [];
   ```
   2. 在通过其他引擎对刚体进行贴图显示之后，还需要注意一件事情，需要实时的去调用world.step(number)
   3. 其他需要注意的地方还有，p2与egret的坐标系并不一样，要注意对坐标的转换，egret的锚点是在左上角，p2的锚点是在中心。而贴图的本质就是将egret的显示对象实时的覆盖在刚体上面，所以一般要对egret的锚点进行处理，将其移动到中心，这样才可以确保在对egret显示对象设置刚体位置时，是准确的位置。
## 世界world
世界的步函数step()决定了刚体在世界中的运动方式，可以简单的理解为快慢，它的第一个参数值与设备的帧率计算有关系，还需再研究一下。
- 在p2与egret结合使用时，需要在egret中去渲染p2算法库，常用的方法有两种：
   1. 使用startTick(心跳)进行处理，函数会一直以60帧的速率运行，修改帧数是对运行速率没有影响的。
   2. 使用enterFrame事件进行处理，该事件会根据实时的帧率进行计算。
## 鸣谢 
项目参考：
1. egret论坛中的官方教程
2. 论坛大神的示例 [传送门](https://bbs.egret.com/forum.php?mod=viewthread&tid=15762&highlight=p2)
3.  ***如涉及侵权，请及时私信。感谢上述大佬们～。～***
---