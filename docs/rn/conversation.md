
### 获取会话

```javascript
import { getConversation } from "rongcloud-react-native-imlib";

const conversation = await getConversation(conversationType, targetId);
```

### 获取会话

```javascript
import { removeConversation } from "rongcloud-react-native-imlib";

removeConversation(conversationType, targetId);
```

### 置顶会话

```javascript
import { setConversationToTop, getTopConversationList } from "rongcloud-react-native-imlib";

// 置顶会话
setConversationToTop(conversationType, targetId, true);

// 获取置顶的会话
const conversations = await getTopConversationList();
```

### 搜索会话

```javascript
import { searchConversations, ConversationType, ObjectName } from "rongcloud-react-native-imlib";

const conversationTypes = [ConversationType.PRIVATE];
const objectNames = [ObjectName.Text, ObjectName.Image];

const conversations = await searchConversations(keyword, conversationTypes, objectNames);
```

### 会话草稿消息

这些草稿信息仅存储于本地数据库中，不会上传服务器。

```javascript
import { saveTextMessageDraft, getTextMessageDraft } from "rongcloud-react-native-imlib";

// 设置会话文本消息草稿
saveTextMessageDraft(conversationType, targetId, content);

// 获取会话文本消息草稿
const text = getTextMessageDraft(conversationType, targetId);
```

### 会话消息提醒

通过融云 SDK，您可以设置会话的提醒状态来实现免打扰功能。按照免打扰作用范围，分为两种类型：

- 设置单个会话的提醒状态。通过此方法，您可以屏蔽某个会话的通知提醒和推送。

```javascript
import {
  setConversationNotificationStatus,
  getConversationNotificationStatus
} from "rongcloud-react-native-imlib";

// 设置会话文本消息草稿
setConversationNotificationStatus(conversationType, targetId, isBlocked);

// 获取会话文本消息草稿
const isBlock = getConversationNotificationStatus(conversationType, targetId);
```

- 设置所有会话的通知免打扰。可以设置某一个时间段免打扰，也可以设置全天免打扰。

```javascript
import {
  setNotificationQuietHours,
  removeNotificationQuietHours
} from "rongcloud-react-native-imlib";

// 设置全局消息免打扰时段
// startTime 的格式为 HH:MM:SS
// spanMinutes 为设置的免打扰结束时间距离起始时间的间隔分钟数
setNotificationQuietHours(startTime, spanMinutes);

// 移除全局消息免打扰
removeNotificationQuietHours();
```
