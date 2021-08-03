

使用 `recallMessage` 接口可以撤回已发送的消息，撤回成功后，该消息在数据库中将被替换成 `RecallNotificationMessage`，您需要在成功回调里重新加载这条数据，刷新聊天界面。

```javascript
import { recallMessage } from "rongcloud-react-native-imlib";

const recallNotificationMessage = await recallMessage(messageId);
```
