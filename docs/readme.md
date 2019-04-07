## 前期准备

### 注册开发者账号

请前往[融云官方网站](https://developer.rongcloud.cn/signup)注册开发者帐号。注册时，您需要提供真实的邮箱和手机号，以方便我们向您发送重要通知并在紧急时刻能够联系到您。
如果您没有提供正确可用的邮箱和手机号，我们随时可能关闭您的应用。

### 创建应用

注册了开发者帐号之后，在进行开发 App 之前，您需要前往[融云开发者控制台](https://developer.rongcloud.cn/signup)创建应用。
创建完应用之后，在您的应用中，会自动创建两套环境，即：开发环境和生产环境

![](https://user-images.githubusercontent.com/1709072/55678058-2bcd1280-5926-11e9-867f-b6964b1bdbaf.png)

开发环境专门用于开发测试，生产环境专门用于您的应用上线正式商用。两套环境相互隔离，每个环境都有相应的 App Key 和 App Secret。两个环境消息不互通。

### 获取 Token

Token 称为用户令牌，App Key 是您的 App 的唯一标识，Token 则是您 App 上的每一个用户的身份授权象征。
您可以通过提交 userId 等信息来获得一个该用户对应的 Token，并使用这个 Token 作为该用户的唯一身份凭证与其他用户进行通信。

Token 的主要作用是身份授权和安全，因此不能通过客户端直接访问融云服务器获取 Token，您必须通过 Server API 从融云服务器获取 Token 返回给您的 App，并在之后连接时使用。
详细描述请参考 [Server 开发指南](https://www.rongcloud.cn/docs/server.html#获取_Token_方法) 中的用户服务和获取 Token 方法小节。

> 为了方便您在集成和测试过程中使用，我们还提供了 API 调试工具，在您不能部署服务器程序时，可以直接通过传入 userId 和 name 来获得 Token。
> 请访问融云开发者平台，打开您想测试的应用，在左侧菜单中选择 “[API 调试](https://developer.rongcloud.cn/apitool/qmZqBYUO1SBO+jDieKo=)”即可。

## SDK 集成

```
yarn add rongcloud-react-native-imlib
```

### Android

运行 `react-native link rongcloud-react-native-imlib` 进行自动配置（推荐），或按以下步骤进行手动配置：

1. 编辑 `android/settings.gradle` 新增：

   ```gradle
   include ':rongcloud-react-native-imlib'
   project(':rongcloud-react-native-imlib').projectDir = new File(rootProject.projectDir, '../node_modules/rongcloud-react-native-imlib/lib/android')
   ```

2. 编辑 `android/app/build.gradle`，新增依赖：

   ```
   dependencies {
     ...
     compile project(':rongcloud-react-native-imlib')
   }
   ```

3. 编辑 `MainApplication.java`：

   导入 RCIMLibPackage

   ```java
   import cn.rongcloud.imlib.react.RCIMLibPackage;
   ```

   添加 RCIMLibPackage

   ```java
   @Override
   protected List<ReactPackage> getPackages() {
       return Arrays.asList(
               new MainReactPackage(),
               new RCIMLibPackage()
       );
   }
   ```

### iOS

运行 `react-native link rongcloud-react-native-imlib` 进行自动配置（推荐），或按以下步骤在 Xcode 进行手动配置：

1. Project navigator ➜ 右击 `Libraries` ➜ 选择 `Add Files to "XXXX"...`

   <img src="https://user-images.githubusercontent.com/1709072/55277292-70aae500-5339-11e9-9949-713c4ba28ccb.png" width=240>

2. 找到并选择添加 `node_modules/rongcloud-react-native-imlib/lib/ios/RCIMLib.xcodeproj`

   <img src="https://user-images.githubusercontent.com/1709072/55277323-c7b0ba00-5339-11e9-982e-3b87a510cca8.png" width=600>

3. `Build Phases` ➜ `Link Binary With Libraries` 中选择并添加 `libRNIMLib.a`

   <img src="https://user-images.githubusercontent.com/1709072/55277356-3e4db780-533a-11e9-8f3b-141b005e449a.png" width=600>

接下来，将 IMLib SDK 引入项目：

1. [从官网下载 IMLib SDK](https://www.rongcloud.cn/downloads)

2. 解压并把 `IMLib` 文件夹放到 `ios` 目录

3. 把 `IMLib` 里的 `libopencore-amrnb.a`、`libopencore-amrwb.a`、 `RongIMLib.framework` 拖入 Project navigator `Frameworks`

4. `Build Phases` ➜ `Link Binary With Libraries` 里搜索并添加 `libsqlite3.tbd`

   <img src="https://user-images.githubusercontent.com/1709072/55277928-88399c00-5340-11e9-938c-f88cd832d0de.png" width=600>

## 基本用法

```javascript
// 按需导入方法
import { init, connect } "rongcloud-react-native-imlib"

// 或导入所有方法到一个对象
import * as IMClient "rongcloud-react-native-imlib"
```

### 初始化 SDK

您在使用融云 SDK 所有功能之前，您必须先调用此方法初始化 SDK。在 App 的整个生命周期中，您只需要将 SDK 初始化一次。

```javascript
import { init } "rongcloud-react-native-imlib"

init("Your appKey");
```

### 连接服务器

在 App 整个生命周期，您只需要调用一次此方法与融云服务器建立连接。之后无论是网络出现异常或者 App 有前后台的切换等，SDK 都会负责自动重连。
SDK 针对 App 的前后台和各种网络状况，进行了连接和重连机制的优化，建议您调用一次 `connect` 即可，其余交给 SDK 处理。
除非您已经手动将连接断开，否则您不需要自己再手动重连。

```javascript
import { connect } "rongcloud-react-native-imlib"

function onSuccess(userId) {
  console.log("连接成功：" + userId);
}

function onError(errorCode) {
  console.log("连接失败：" + errorCode);
}

function onTokenIncorrect() {
  console.log("Token 不正确或已过期");
}

connect(token, onSuccess, onError, onTokenIncorrect);
```

### 监听连接状态