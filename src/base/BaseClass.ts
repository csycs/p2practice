class BaseClass {
    //提供单例模式的基类
    public static getInstance(): any {
        var Class: any = this;
        if (!Class._instance) {
            Class._instance = new Class();
        }
        return Class._instance;
    }
}