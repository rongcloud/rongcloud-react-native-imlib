
!!! info "说明"
    
    融云 [React Native IMLib](https://github.com/rongcloud/rongcloud-react-native-imlib?_blank) 是以 IMLib SDK 5.1.3 版本为基础实现的开源项目，支持 Android、iOS，开发者在集成使用过程中如遇到问题可提交到 GitHub 的 Issues 中，融云技术支持人员会在 1 个工作日内回复问题，谢谢您对融云的理解与支持。


### 帐号注册

请前往[融云官方网站](https://developer.rongcloud.cn/signup?_blank)注册开发者帐号。

### 创建应用

注册了开发者帐号之后，在进行开发 App 之前，需要前往[融云开发者控制台](https://developer.rongcloud.cn/signup?_blank)创建应用。创建完应用之后，会自动创建两套环境，即：开发环境和生产环境

![image](/im/imlib/android/img/quickimg1.png)

开发环境专门用于开发测试，生产环境专门用于应用上线正式商用。两套环境相互隔离，每个环境都有相应的 App Key 和 App Secret。两个环境消息不互通。

### 获取 Token

Token 称为用户令牌，App Key 是 App 的唯一标识，Token 则是 App 上的每一个用户的身份授权象征。

可以通过提交 userId 等信息来获得一个该用户对应的 Token，并使用这个 Token 作为该用户的唯一身份凭证与其他用户进行通信。

Token 的主要作用是身份授权和安全，因此不能通过客户端直接访问融云服务器获取 Token，必须通过 Server API 从融云服务器获取 Token 返回给 App，并在之后连接时使用。
详细描述请参考 [Server 开发指南](/im/server/user/#token?_blank) 中的用户服务和获取 Token 方法小节。

为了方便在集成和测试过程中使用，我们还提供了 API 调试工具，在不能部署服务器程序时，可以直接通过传入 userId 和 name 来获得 Token。

请访问融云开发者平台，打开您想测试的应用，在左侧菜单中选择 “[API 调试](https://developer.rongcloud.cn/apitool/qmZqBYUO1SBO+jDieKo=)”即可。
