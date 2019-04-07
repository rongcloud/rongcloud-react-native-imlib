# rongcloud-react-native-imlib
融云 IMLib 的 React Native 原生模块，支持 Android + iOS

## 文档

- [使用指南](https://qiuxiang.github.io/react-native-rongcloud-imlib/)
- [接口文档](https://qiuxiang.github.io/react-native-rongcloud-imlib/api/modules/rcimclient.html)

## 用法

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

## 运行示例

如果要运行 iOS 示例，需要进行以下操作：
1. [从官网下载 IMLib SDK](https://www.rongcloud.cn/downloads)
2. 解压并把 `IMLib` 文件夹放到 `ios` 目录

```
yarn
yarn build
yarn run-ios
yarn run-android
```

## 项目结构
```
├── android (Android 示例应用)
├── docs (接口文档)
├── example (React Native 示例)
├── ios (iOS 示例应用)
├── lib
│   ├── android (Android 原生模块)
│   └── ios (iOS 原生模块)
└── src (接口实现)
```
