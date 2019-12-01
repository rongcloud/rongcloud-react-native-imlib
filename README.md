# rongcloud-react-native-imlib [![npm version][version-badge]][npm]

融云 React Native IMLib 是以 IMLib SDK 2.9.12 版本为基础实现的开源项目，支持 Android、iOS，开发者在集成使用过程中如遇到问题可提交到 GitHub 的 Issues 中，融云技术支持人员会在 1 个工作日内回复问题，谢谢您对融云的理解与支持。

## 文档

- [使用指南](https://www.rongcloud.cn/docs/react_native_imlib.html)
- [接口文档](https://qiuxiang.github.io/react-native-rongcloud-imlib/api/globals.html)

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
import { sendMessage, ConversationType, ObjectName } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "n19jmcy59f1q9";
const content = { objectName: ObjectName.Text, content: "这是一个文本消息" };

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

```
yarn global add typescript
yarn build

# android
yarn run-android

# ios
cd ios
pod install
cd ..
yarn run-ios
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

[npm]: https://www.npmjs.com/package/rongcloud-react-native-imlib
[version-badge]: https://badge.fury.io/js/rongcloud-react-native-imlib.svg
