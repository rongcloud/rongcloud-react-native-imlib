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
import { init, connect } from "rongcloud-react-native-imlib";

// 或导入所有方法到一个对象
import * as IMClient from "rongcloud-react-native-imlib";
```

### 初始化 SDK

您在使用融云 SDK 所有功能之前，您必须先调用此方法初始化 SDK。在 App 的整个生命周期中，您只需要将 SDK 初始化一次。

```javascript
import { init } from "rongcloud-react-native-imlib";

init("Your appKey");
```

### 连接服务器

在 App 整个生命周期，您只需要调用一次此方法与融云服务器建立连接。之后无论是网络出现异常或者 App 有前后台的切换等，SDK 都会负责自动重连。
SDK 针对 App 的前后台和各种网络状况，进行了连接和重连机制的优化，建议您调用一次 `connect` 即可，其余交给 SDK 处理。
除非您已经手动将连接断开，否则您不需要自己再手动重连。

```javascript
import { connect, ErrorCode } from "rongcloud-react-native-imlib";

function onSuccess(userId) {
  console.log("连接成功：" + userId);
}

function onError(errorCode) {
  console.log("连接失败：" + errorCode);
}

function onTokenIncorrect() {
  console.log("Token 不正确或已过期");
}

connect(
  token,
  onSuccess,
  onError,
  onTokenIncorrect
);
```

### 监听连接状态

```javascript
import { addConnectionStatusListener } from "rongcloud-react-native-imlib";

const listener = addConnectionStatusListener(status => console.log(status));

// 移除监听
listener.remove();
```

### 断开连接

```javascript
import { disconnect } from "rongcloud-react-native-imlib";

// 断开连接，但仍然可以接收推送消息
disconnect();

// 断开连接，不再接收推送消息
disconnect(false);
```

## 消息接口

### 发送消息

融云支持向单聊、群组及聊天室中发送文字消息、图片消息、语音消息、文件消息、富文本消息、地理位置消息以及自定义消息。
融云 React Native SDK 不提供语音录制、转码功能，开发者需要自已实现语音消息录制、转码，通过融云内置的语音消息进行发送。

#### 发送文本消息

```javascript
import { sendMessage, ConversationType } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "userId"; // 根据会话类型的不同，可以是用户 ID、讨论组 ID、组群 ID 等
const content = { type: "text", content: "Hello" };
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};

sendMessage({ conversationType, targetId, content }, callback);
```

#### 发送图片信息

```javascript
import { sendMediaMessage, cancelSendMediaMessage } from "rongcloud-react-native-imlib";

const content = { type: "image", local: "file:///image_path" };
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  progress(progress, messageId) {
    console.log(`发送进度: ${progress} %`);

    // 消息发送过程中可随时取消发送
    cancelSendMediaMessage(messageId);
  },
  cancel() {
    console.log("发送取消");
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};

sendMediaMessage({ conversationType, targetId, content }, callback);
```

#### 发送文件

```javascript
import { sendMediaMessage } from "rongcloud-react-native-imlib";

const content = { type: "file", local: "file:///image_path" };
sendMediaMessage({ conversationType, targetId, content }, callback);
```

#### 发送位置信息

```javascript
import { sendMessage } from "rongcloud-react-native-imlib";

const content = {
  type: "location",
  latitude: 34,
  longitude: 108,
  name: "海龙大厦",
  thumbnail: "http://example.com/thum.jpg"
};

sendMessage({ conversationType, targetId, content }, callback);
```

### 消息监听

通过添加消息监听器，可以监听到所有接收的消息。

```javascript
import { addReceiveMessageListener } from "rongcloud-react-native-imlib";

const listener = addReceiveMessageListener(message => {
  console.log(message);
});
```

### 获取本地消息历史

```javascript
import { getHistoryMessages } from "rongcloud-react-native-imlib";

// 获取指定会话消息，默认获取最新 10 条
const messages = await getHistoryMessages(conversationType, targetId);

// 获取会话中从某条消息开始的指定个数的消息
const messages = await getHistoryMessages(conversationType, targetId, "", messageId, 20);

// 获取会话中从某条消息往前的指定个数的文本消息
const messages = await getHistoryMessages(
  conversationType,
  targetId,
  "RC:TxtMsg",
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

> 该功能需要在开发者后台“应用/IM 服务/高级功能设置”中开通 IM 商用版后，开启`单群聊消息云存储`功能才能使用，开发环境下可免费使用。
> [查看收费详情](http://www.rongcloud.cn/pricing#pay)

```javascript
import { getRemoteHistoryMessages } from "rongcloud-react-native-imlib";

// 获取指定会话从某个时间戳开始的 n 条消息
const messages = await getRemoteHistoryMessages(conversationType, targetId, timestamp, 20);
```

### 清除历史消息

```javascript
import { cleanHistoryMessages } from "rongcloud-react-native-imlib";

cleanHistoryMessages(conversationType, targetId, timestamp, isCleanRemote);
```

### 插入消息

您可以只在本地存储中插入一条消息，但是不向外发送。

```javascript
import {
  insertIncomingMessage,
  insertOutgoingMessage,
  SentStatus
} from "rongcloud-react-native-imlib";

const content = { type: "text", content: "Hello" };

// 插入一条发送消息
const message = await insertOutgoingMessage(conversationType, targetId, SentStatus.SENT, content);

// 插入一条接收消息
const message = await insertIncomingMessage(
  conversationType,
  targetId,
  senderId,
  receivedStatus,
  content
);
```

### 删除消息

```javascript
import { deleteMessages } from "rongcloud-react-native-imlib";

// 删除指定 ID 的消息
deleteMessages(["messageId 1", "messageId 2"]);

// 删除指定会话的所有消息
deleteMessages(conversationType, targetId);
```

### 搜索消息

```javascript
import { searchMessages } from "rongcloud-react-native-imlib";

const messages = await searchMessages(ConversationType, targetId, keyword, count);
```

## 会话管理

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
import { searchConversations, ConversationType } from "rongcloud-react-native-imlib";

const conversationTypes = [ConversationType.PRIVATE];
const objectNames = ["RC:TxtMsg", "RC:ImgMsg"];

const conversations = await searchConversations(keyword, conversationTypes, objectNames);
```

### 会话文本消息草稿

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

## 黑名单管理

您可以将用户加入、移出黑名单，也可以查询当前已经设置的黑名单。

```javascript
import {
  addToBlacklist,
  removeFromBlacklist,
  getBlacklistStatus,
  getBlacklist
} from "rongcloud-react-native-imlib";

// 将用户添加至黑名单
addToBlacklist(userId);

// 将用户从黑名单移出
removeFromBlacklist(userId);

// 查询某个用户是否已经在黑名单中
const isBlack = await getBlacklistStatus(userId);

// 获取所有黑名单
const blackList = await getBlacklist();
```

## 组群业务

群组关系和群组列表由您的 App 维护，客户端的所有群组操作都需要请求您的 App Server，
您的 App Server 可以根据自己的逻辑进行管理和控制，然后通过 Server API 接口进行群组操作，并将结果返回给客户端。

以下展示了客户端进行群组操作的流程。

### 创建组群

![](https://user-images.githubusercontent.com/1709072/55683214-e7fefb00-596f-11e9-9669-01d6ab343f8f.png)

### 加入群组

![](https://user-images.githubusercontent.com/1709072/55683227-17156c80-5970-11e9-9f01-66ffd677ed2e.png)

### 退出群组

![](https://user-images.githubusercontent.com/1709072/55683232-272d4c00-5970-11e9-870e-530452b9c29a.png)

### 解散群组

![](https://user-images.githubusercontent.com/1709072/55683237-36ac9500-5970-11e9-91ef-dc8ebc3c51c2.png)

### 设置群组信息

![](https://user-images.githubusercontent.com/1709072/55683244-47f5a180-5970-11e9-95fc-4f68b4424fae.png)

### 获取群组成员列表

![](https://user-images.githubusercontent.com/1709072/55683252-5b087180-5970-11e9-8b5c-c2e2fe37c49e.png)

### 获取群组列表

![](https://user-images.githubusercontent.com/1709072/55683253-5d6acb80-5970-11e9-8e05-753c190242b4.png)

> 建议在登录成功之后从 App 服务器获取一次群组列表信息，以保证客户端和服务器的群组信息同步，提升用户体验。

## 聊天室业务

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

### 获取服务器聊天室历史消息

> 该功能需开通后才能使用，详细请查看[聊天室消息云存储服务说明](https://www.rongcloud.cn/docs/payment.html#chatroom_message_cloud_storage)。

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

## 客服业务

- 在进入到客服聊天界面时，调用 `startCustomService` 来启动客服服务。启动的状态要在回调里面处理，启动成功后会回调 `success`，
  并携带配置信息 `CustomServiceConfig` 。根据 `modeChanged` 回调来处理不同的键盘输入。在机器人优先模式下，需要在界面上加上转人工的按钮。

- 当 `quit` 时，离开客服会话或者提示客服服务已经结束。

- 当用户按下转人工服务时，调用 `switchToHumanMode` 来切换到人工服务。如果调用成功，`modeChanged` 回调返回服务类型。

- 当离开界面时，调用 `stopCustomeService` 来结束客服。

- 在适当的时机对客服进行评价，调用 `evaluateCustomService`，根据参数不同评价机器人或者人工。

- 当 `selectGroup` 时，App 需要弹出技能组选择界面供用户选择。

- 当用户选择技能组后，调用 `selectCustomerServiceGroup` 来启动对应技能组客服，
  如果用户没有选择，也必须调用 `selectCustomerServiceGroup` 来启动默认客服，groupId 此时为 `null`。

```typescript
/**
 * 发起客服聊天回调
 */
type CSCallback = {
  success?: (config: CSConfig) => void;
  error?: (code: number, message: string) => void;
  modeChanged?: (mode: CSMode) => void;
  pullEvaluation?: (dialogId: string) => void;
  quit?: (message: string) => void;
  selectGroup?: (groups: CSGroupItem[]) => void;
};

/**
 * 发起客服聊天
 *
 * @param kefuId 客服 ID
 * @param csInfo 客服信息
 * @param callback 回调
 */
function startCustomerService(kefuId: string, csInfo: CSInfo, callback?: CSCallback): void;

/**
 * 切换至人工客服
 *
 * @param kefuId 客服 ID
 */
function switchToHumanMode(kefuId: string): void;

/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param groupId 分组 ID
 */
function selectCustomerServiceGroup(kefuId: string, groupId: string): void;

/**
 * 评价客服
 *
 * @param kefuId 客服 ID
 * @param dialogId 会话 Id，客服后台主动拉评价的时候（onPullEvaluation）这个参数有效，其余情况传空字符串即可
 * @param value 评价分数，取值范围 1 - 5
 * @param suggest 客户建议
 * @param resolveStatus 解决状态
 * @param tagText 标签
 * @param extra 用于扩展的额外信息
 */
function evaluateCustomerService(
  kefuId: string,
  dialogId: string,
  value: string,
  suggest: string,
  resolveStatus: number,
  tagText?: string,
  extra?: string
): void;

/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param message 客服留言信息
 */
function leaveMessageCustomerService(kefuId: string, message: CSLeaveMessageItem): void;

/**
 * 结束客服聊天
 *
 * @param kefuId 客服 ID
 */
function stopCustomerService(kefuId: string): void;
```

## 公众号业务

融云公众服务是为应用开发者和公众帐号运营者提供的连接服务产品，通过融云公众服务，App 可以具备为自己的用户提供公众帐号服务的能力和资源。

公众服务包括：应用公众服务和公众服务平台。

应用公众服务：是为应用开发者提供的 App 内建公众服务能力，通过在融云开发者站点创建 App 公众号，实现应用内的公众服务。

公众服务平台：是在应用开发者和公众帐号运营者之间建立的对接平台，应用开发者可以通过平台引入公众服务资源，帮助 App 快速覆盖用户需求，
公众帐号持有者通过平台可以有机会向所有集成融云 SDK 的 App 提供服务，进而获得更加精准更加丰富的受众渠道。

开发者可以参考[融云公众号开发文档](http://www.rongcloud.cn/docs/public_service.html)，注册您应用自己的公众服务。客户端可以通过 SDK 中的接口来订阅或者取消订阅公众号。

### 搜索公众号

```javascript
import { searchPublicService, SearchType, PublicServiceType } from "rongcloud-react-native-imlib";

// 按关键字搜索
const accounts = await searchPublicService("关键字", SearchType.FUZZY);

// 按关键字并且指定公众号类型搜索
const accounts = await searchPublicService(
  "关键字",
  SearchType.FUZZY,
  PublicServiceType.PUBLIC_SERVICE
);
```

### 获取公众号信息

```javascript
import { getPublicServiceProfile } from "rongcloud-react-native-imlib";

const profile = await getPublicServiceProfile(publicServiceType, publicServiceId);
```

### 订阅公众号

```javascript
import { subscribePublicService, unsubscribePublicService } from "rongcloud-react-native-imlib";

// 订阅公众号
subscribePublicService(publicServiceType, publicServiceId);

// 取消订阅公众号
unsubscribePublicService(publicServiceType, publicServiceId);
```

### 获取已订阅公众号列表

```javascript
import { getPublicServiceList } from "rongcloud-react-native-imlib";

const list = await getPublicServiceList();
```

## 高级功能

### 消息撤回

使用 `recallMessage` 接口可以撤回已发送的消息，撤回成功后，该消息在数据库中将被替换成 `RecallNotificationMessage`，您需要在成功回调里重新加载这条数据，刷新聊天界面。

```javascript
import { recallMessage } from "rongcloud-react-native-imlib";

const recallNotificationMessage = await recallMessage(messageId);
```

### 单聊消息阅读回执

您可以在用户查看了单聊会话中的未读消息之后，向会话中发送已读回执，会话中的用户可以根据此回执，在 UI 中更新消息的显示。
其中，timestamp 为会话中用户已经阅读的最后一条消息的发送时间戳（Message 的 sentTime 属性），代表用户已经阅读了该会话中此消息之前的所有消息。

```javascript
import { sendReadReceiptMessage } from "rongcloud-react-native-imlib";

sendReadReceiptMessage(conversationType, targetId, timestamp);
```

在接收端，您可以添加阅读回执消息监听函数。

```javascript
import { addReadReceiptReceivedListener } from "rongcloud-react-native-imlib";

addReadReceiptReceivedListener(message => console.log(message));
```

### 组群消息阅读回执

群组消息请求回执，对于需要阅读之后收到阅读回执的消息，可以调用这个接口来发送阅读回执请求。

```javascript
import { sendReadReceiptRequest, addReceiptRequestListener } from "rongcloud-react-native-imlib";

// 发送阅读回执请求
sendReadReceiptRequest(messageId);

// 收到消息已读回执请求的回调函数（收到此请求后，如果用户阅读了对应的消息，需要调用 sendMessageReadReceiptResponse 接口发送已读响应）
addReceiptRequestListener(message => console.log(message));
```

已读响应，当收到阅读回执请求之后，如果用户阅读了对应的消息，可以调用此接口来发送消息阅读回执响应。

```javascript
import { sendReadReceiptResponse, addReceiptResponseListener } from "rongcloud-react-native-imlib";

// 发送阅读回执
sendReadReceiptResponse(conversationType, targetId, messageList);

// 消息已读回执响应
addReceiptResponseListener(message => console.log(message));
```

### 多端阅读消息数同步

多端登录时，通知其它终端同步某个会话的阅读状态，请调用下面接口：

```javascript
import { syncConversationReadStatus } from "rongcloud-react-native-imlib";

// 其中 timestamp 为该会话中已读的最后一条消息的发送时间戳
syncConversationReadStatus(conversationType, targetId, timestamp);
```

### 输入状态提醒

您可以在用户正在输入的时候，向对方发送正在输入的状态。目前该功能只支持单聊。

其中，您可以在 `typingContentType` 中传入消息的类型名，会话中的其他用户输入状态监听中会收到此消息类型。
您可以通过此消息类型，自定义不同的输入状态提示（如：正在输入、正在讲话、正在拍摄等）。

在 6 秒之内，如果同一个用户在同一个会话中多次调用此接口发送正在输入的状态，为保证产品体验和网络优化，将只有最开始的一次生效。

```javascript
import { sendTypingStatus } from "rongcloud-react-native-imlib";

sendTypingStatus(conversationType, targetId, typingContentType);
```

在接收端，您可以设置输入状态的监听器。

当前会话正在输入的用户有变化时，会触发监听中的 onTypingStatusChanged()，回调里携带有当前正在输入的用户和消息类型。
对于单聊而言，当对方正在输入时，监听会触发一次；当对方不处于输入状态时，该监听还会触发一次，但是回调里并不携带用户和消息类型，开发者需要在此时取消正在输入的显示。

```javascript
import { addTypingStatusListener } from "rongcloud-react-native-imlib";

addTypingStatusListener(({ conversationType, targetId, userId, typingContentType }) => {
  if (userId) {
    console.log("用户输入状态：" + typingContentType);
  } else {
    console.log("用户不再输入");
  }
});
```

### 群定向消息

此方法用于在群组中给部分用户发送消息，其它用户不会收到这条消息，建议向群中部分用户发送状态类消息时使用此功能。

注：群定向消息不存储到云端，通过“单群聊消息云存储”服务无法获取到定向消息。

```javascript
import { sendDirectionalMessage } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "groupId"; // 只能是组群 ID
const content = { type: "text", content: "Hello" };
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};

const userIds = ["user1", "user2"];

sendDirectionalMessage({ conversationType, targetId, content }, userIds, callback);
```

