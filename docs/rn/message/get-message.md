
### 获取本地消息历史

```javascript
import { getHistoryMessages, ObjectName } from "rongcloud-react-native-imlib";

// 获取指定会话消息，默认获取最新 10 条
const messages = await getHistoryMessages(conversationType, targetId);

// 获取会话中从某条消息开始的指定个数的消息
const messages = await getHistoryMessages(conversationType, targetId, "", messageId, 20);

// 获取会话中从某条消息往前的指定个数的文本消息
const messages = await getHistoryMessages(
  conversationType,
  targetId,
  ObjectName.Text,
  messageId,
  20,
  false
);

// 获取会话中从某个时间戳开始的消息
const messages = await getHistoryMessages(conversationType, targetId, [], timestamp);

// 获取会话中从某个时间戳往前的指定类型、指定个数的消息
const messages = await getHistoryMessages(
  conversationType,
  targetId,
  ["RC:TxtMsg", "RC:ImgMsg"],
  timestamp,
  20,
  false
);
```

### 获取服务端历史消息

提供单聊、群聊、客服的历史消息获取，您每次可以从服务器获取之前 20 条以内的消息历史记录，最多获取前 6 个月的历史消息。

该功能需要在开发者后台“应用/IM 服务/高级功能设置”中开通 IM 商用版后，开启`单群聊消息云存储`功能才能使用，开发环境下可免费使用。

[查看收费详情](http://www.rongcloud.cn/pricing#pay)

```javascript
import { getRemoteHistoryMessages } from "rongcloud-react-native-imlib";

// 获取指定会话从某个时间戳开始的 n 条消息
const messages = await getRemoteHistoryMessages(conversationType, targetId, timestamp, 20);
```
