
聊天室是指多个用户一起聊天，用户数量没有上限。和其它业务场景的主要区别如下：

- 用户退出聊天界面后即视为离开聊天室，不会再接收到任何聊天室消息。

- 聊天室消息不会保存到本地数据库，融云服务端最多保存聊天室最近的 50 条消息。客户端在调用加入聊天室接口时可以设置进入聊天室时的拉取消息数量。

- 聊天室的会话关系由融云负责建立并保持连接，通过 SDK 相关接口，可以让用户加入或者退出聊天室。

### 加入聊天室

```javascript
import { joinChatRoom, joinExistChatRoom, ErrorCode } from "rongcloud-react-native-imlib";

// 加入聊天室，如果聊天室不存在，会自动创建并加入。
// messageCount 为默认拉取的消息数量，-1 时不拉取任何消息，0 时拉取 10 条消息，最多只能拉取 50 条
joinChatRoom(chatRoomId, messageCount);

// 加入已经存在的聊天室，如果聊天室不存在，则会抛出错误
try {
  await joinExistChatRoom(chatRoomId, messageCount);
} catch (error) {
  if (error.code === ErrorCode.CHATROOM_NOT_EXIST) {
    console.log("聊天室不存在");
  }
}
```

### 退出聊天室

```javascript
import { quitChatRoom } from "rongcloud-react-native-imlib";

quitChatRoom(chatRoomId);
```

### 查询聊天室信息

查询聊天室中最早或最晚加入的 N 个成员信息，包括成员 id， 加入聊天室时间，以及当前聊天室总人数。

```javascript
import { getChatRoomInfo, ChatRoomMemberOrder } from "rongcloud-react-native-imlib";

// 获取的成员数为 memberCount，排序方式按成员加入时间倒序排序
const info = await getChatRoomInfo(chatRoomId, memberCount, ChatRoomMemberOrder.DESC);
```

### 获取服务器历史消息

该功能需开通后才能使用，详细请查看[聊天室消息云存储服务说明](https://support.rongcloud.cn/ks/OTQ2?_blank)。

开通聊天室消息存储功能后，融云内置的文字、语音、图片、图文、位置、文件等消息会自动在服务器端进行存储。

```javascript
import { getChatroomHistoryMessages, TimestampOrder } from "rongcloud-react-native-imlib";

// 获取从 timestamp 开始的 count 条消息，按倒序排序
const messages = await getChatroomHistoryMessages(
  chatRoomId,
  timestamp,
  count,
  TimestampOrder.DESC
);
```
