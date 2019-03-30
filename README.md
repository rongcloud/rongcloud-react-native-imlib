# rongcloud-react-native-imlib
融云 IMLib 的 React Native 原生模块，支持 Android + iOS

## 安装

```
yarn add rongcloud-react-native-imlib
```

## 集成

### iOS

运行 `react-native link rongcloud-react-native-imlib` 进行自动配置（推荐），或按以下步骤在 Xcode 进行手动配置：

1. <details>
   <summary>Project navigator ➜ 右击 <code>Libraries</code> ➜ 选择 <code>Add Files to "XXXX"...</code></summary>
   <img src="https://user-images.githubusercontent.com/1709072/55277292-70aae500-5339-11e9-9949-713c4ba28ccb.png" width=240>
   </details>
2. <details>
   <summary>找到并选择添加 <code>node_modules/rongcloud-react-native-imlib/lib/ios/RCIMLib.xcodeproj</code></summary>
   <img src="https://user-images.githubusercontent.com/1709072/55277323-c7b0ba00-5339-11e9-982e-3b87a510cca8.png" width=600>
   </details>
3. <details>
   <summary><code>Build Phases</code> ➜ <code>Link Binary With Libraries</code> 中选择并添加 <code>libRNIMLib.a</code></summary>
   <img src="https://user-images.githubusercontent.com/1709072/55277356-3e4db780-533a-11e9-8f3b-141b005e449a.png" width=600>
   </details>

接下来，将 IMLib SDK 引入项目：

1. [从官网下载 IMLib SDK](https://www.rongcloud.cn/downloads)
2. 解压并把 `IMLib` 文件夹放到 `ios` 目录
3. 把 `IMLib` 里的 `libopencore-amrnb.a` 和 `RongIMLib.framework` 拖入 Project navigator `Frameworks`
4. <details>
   <summary><code>Build Phases</code> ➜ <code>Link Binary With Libraries</code> 里搜索并添加 <code>libsqlite3.tbd</code></summary>
   <img src="https://user-images.githubusercontent.com/1709072/55277928-88399c00-5340-11e9-938c-f88cd832d0de.png" width=600>
   </details>

### Android

运行 `react-native link rongcloud-react-native-imlib` 进行自动配置（推荐），或按以下步骤进行手动配置：

1. 编辑 `android/settings.gradle` 新增：

   ```gradle
   include ':rongcloud-react-native-imlib'
   project(':rongcloud-react-native-imlib').projectDir = new File(rootProject.projectDir, '../node_modules/rongcloud-react-native-imlib/lib/android')
   ```

2. 编辑 `android/app/build.gradle`，新增：

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

## 使用

### 初始化并连接融云服务

```javascript
import { init, connect } from "rongcloud-react-native-imlib";

init("n19jmcy59f1q9");
connect("FrdcuKklUMakOnYLFljI9gLUrCB73YwHabXQU7yFrr8ow==");
```

### 监听消息

```javascript
import { addReceiveMessageListener } from "rongcloud-react-native-imlib";

addReceiveMessageListener(message => {
  console.log(message);
});
```

### 发送消息

```javascript
import { sendMessage, ConversationType } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "n19jmcy59f1q9";
const content = { type: "text", content: "这是一个文本消息" };

sendMessage(
  { conversationType, targetId, content },
  {
    success: messageId => console.log("消息发送成功：" + messageId),
    error: errorCode => console.log("消息发送失败：" + errorCode)
  }
);
```

更多示例请参考 [examples](example/examples)。
