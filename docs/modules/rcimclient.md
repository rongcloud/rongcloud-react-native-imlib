[rongcloud-react-native-imlib](../README.md) > [RCIMClient](../modules/rcimclient.md)

# External module: RCIMClient

## Index

### Enumerations

* [ChatRoomMemberOrder](../enums/rcimclient.chatroommemberorder.md)
* [ConnectErrorCode](../enums/rcimclient.connecterrorcode.md)
* [ConnectionStatusAndroid](../enums/rcimclient.connectionstatusandroid.md)
* [ConnectionStatusIOS](../enums/rcimclient.connectionstatusios.md)
* [ConversationNotificationStatus](../enums/rcimclient.conversationnotificationstatus.md)
* [ConversationType](../enums/rcimclient.conversationtype.md)
* [ErrorCode](../enums/rcimclient.errorcode.md)
* [MessageDirection](../enums/rcimclient.messagedirection.md)
* [MessageObjectNames](../enums/rcimclient.messageobjectnames.md)
* [PublicServiceMenuItemType](../enums/rcimclient.publicservicemenuitemtype.md)
* [PublicServiceType](../enums/rcimclient.publicservicetype.md)
* [SearchType](../enums/rcimclient.searchtype.md)
* [SentStatus](../enums/rcimclient.sentstatus.md)

### Type aliases

* [ChatRoomInfo](rcimclient.md#chatroominfo)
* [ConnectionStatus](rcimclient.md#connectionstatus)
* [Conversation](rcimclient.md#conversation)
* [Discussion](rcimclient.md#discussion)
* [FileMessage](rcimclient.md#filemessage)
* [ImageMessage](rcimclient.md#imagemessage)
* [MemberInfo](rcimclient.md#memberinfo)
* [Message](rcimclient.md#message)
* [MessageContent](rcimclient.md#messagecontent)
* [MessageObjectName](rcimclient.md#messageobjectname)
* [PublicServiceMenuItem](rcimclient.md#publicservicemenuitem)
* [SearchConversationResult](rcimclient.md#searchconversationresult)
* [SentMessage](rcimclient.md#sentmessage)
* [SentMessageCallback](rcimclient.md#sentmessagecallback)
* [TextMessage](rcimclient.md#textmessage)

### Functions

* [addConnectionStatusListener](rcimclient.md#addconnectionstatuslistener)
* [addMemberToDiscussion](rcimclient.md#addmembertodiscussion)
* [addReceiveMessageListener](rcimclient.md#addreceivemessagelistener)
* [addToBlacklist](rcimclient.md#addtoblacklist)
* [cleanRemoteHistoryMessages](rcimclient.md#cleanremotehistorymessages)
* [clearMessages](rcimclient.md#clearmessages)
* [clearMessagesUnreadStatus](rcimclient.md#clearmessagesunreadstatus)
* [connect](rcimclient.md#connect)
* [createDiscussion](rcimclient.md#creatediscussion)
* [deleteMessages](rcimclient.md#deletemessages)
* [deleteRemoteMessages](rcimclient.md#deleteremotemessages)
* [disconnect](rcimclient.md#disconnect)
* [getBlacklist](rcimclient.md#getblacklist)
* [getBlacklistStatus](rcimclient.md#getblackliststatus)
* [getChatRoomInfo](rcimclient.md#getchatroominfo)
* [getConversation](rcimclient.md#getconversation)
* [getConversationList](rcimclient.md#getconversationlist)
* [getConversationNotificationStatus](rcimclient.md#getconversationnotificationstatus)
* [getDiscussion](rcimclient.md#getdiscussion)
* [getHistoryMessages](rcimclient.md#gethistorymessages)
* [getRemoteHistoryMessages](rcimclient.md#getremotehistorymessages)
* [getTextMessageDraft](rcimclient.md#gettextmessagedraft)
* [getTotalUnreadCount](rcimclient.md#gettotalunreadcount)
* [getUnreadCount](rcimclient.md#getunreadcount)
* [init](rcimclient.md#init)
* [insertOutgoingMessage](rcimclient.md#insertoutgoingmessage)
* [joinChatRoom](rcimclient.md#joinchatroom)
* [joinExistChatRoom](rcimclient.md#joinexistchatroom)
* [quitChatRoom](rcimclient.md#quitchatroom)
* [quitDiscussion](rcimclient.md#quitdiscussion)
* [removeConversation](rcimclient.md#removeconversation)
* [removeFromBlacklist](rcimclient.md#removefromblacklist)
* [removeMemberFromDiscussion](rcimclient.md#removememberfromdiscussion)
* [saveTextMessageDraft](rcimclient.md#savetextmessagedraft)
* [searchConversations](rcimclient.md#searchconversations)
* [searchMessages](rcimclient.md#searchmessages)
* [searchPublicService](rcimclient.md#searchpublicservice)
* [sendMessage](rcimclient.md#sendmessage)
* [setConversationNotificationStatus](rcimclient.md#setconversationnotificationstatus)
* [setDeviceToken](rcimclient.md#setdevicetoken)
* [setDiscussionInviteStatus](rcimclient.md#setdiscussioninvitestatus)
* [setDiscussionName](rcimclient.md#setdiscussionname)
* [setServerInfo](rcimclient.md#setserverinfo)

---

## Type aliases

<a id="chatroominfo"></a>

###  ChatRoomInfo

**Ƭ ChatRoomInfo**: *`object`*

*Defined in [index.ts:811](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L811)*

聊天室信息

#### Type declaration

 memberOrder: [ChatRoomMemberOrder](../enums/rcimclient.chatroommemberorder.md)

 members: [MemberInfo](rcimclient.md#memberinfo)[]

 targetId: `string`

 totalMemberCount: `number`

___
<a id="connectionstatus"></a>

###  ConnectionStatus

**Ƭ ConnectionStatus**: *[ConnectionStatusIOS](../enums/rcimclient.connectionstatusios.md) \| [ConnectionStatusAndroid](../enums/rcimclient.connectionstatusandroid.md)*

*Defined in [index.ts:361](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L361)*

___
<a id="conversation"></a>

###  Conversation

**Ƭ Conversation**: *`object`*

*Defined in [index.ts:462](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L462)*

#### Type declaration

 conversationTitle: `string`

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

 draft: `string`

 isTop: `boolean`

 lastestMessage: [MessageContent](rcimclient.md#messagecontent)

 lastestMessageId: `number`

 objectName: `string`

 receivedStatus: `number`

 receivedTime: `number`

 senderUserId: `string`

 sentStatus: [SentStatus](../enums/rcimclient.sentstatus.md)

 targetId: `string`

 unreadMessageCount: `number`

___
<a id="discussion"></a>

###  Discussion

**Ƭ Discussion**: *`object`*

*Defined in [index.ts:846](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L846)*

讨论组

#### Type declaration

 creatorId: `string`

 id: `string`

 isOpen: `boolean`

 memberIdList: `string`[]

 name: `string`

___
<a id="filemessage"></a>

###  FileMessage

**Ƭ FileMessage**: *`object`*

*Defined in [index.ts:143](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L143)*

#### Type declaration

`Optional`  extra: `string`

`Optional`  fileType: `string`

 local: `string`

`Optional`  name: `string`

`Optional`  remote: `string`

`Optional`  size: `number`

 type: "file"

___
<a id="imagemessage"></a>

###  ImageMessage

**Ƭ ImageMessage**: *`object`*

*Defined in [index.ts:134](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L134)*

#### Type declaration

`Optional`  extra: `string`

`Optional`  isFull: `string`

 local: `string`

`Optional`  remote: `string`

`Optional`  thumbnail: `string`

 type: "image"

___
<a id="memberinfo"></a>

###  MemberInfo

**Ƭ MemberInfo**: *`object`*

*Defined in [index.ts:803](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L803)*

聊天室成员信息

#### Type declaration

 joinTime: `number`

 userId: `string`

___
<a id="message"></a>

###  Message

**Ƭ Message**: *`object`*

*Defined in [index.ts:155](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L155)*

#### Type declaration

 content: [MessageContent](rcimclient.md#messagecontent)

消息内容

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

会话类型

`Optional`  extra: `string`

附加信息

 messageDirection: [MessageDirection](../enums/rcimclient.messagedirection.md)

消息方向

 messageId: `number`

消息 ID

 messageUId: `string`

消息 UID

 objectName: `string`

消息对象名称

 receivedTime: `number`

消息接收时间

 senderUserId: `string`

发送者 ID

 sentTime: `number`

发送时间

 targetId: `string`

目标 ID

___
<a id="messagecontent"></a>

###  MessageContent

**Ƭ MessageContent**: *[TextMessage](rcimclient.md#textmessage) \| [ImageMessage](rcimclient.md#imagemessage) \| [FileMessage](rcimclient.md#filemessage)*

*Defined in [index.ts:153](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L153)*

___
<a id="messageobjectname"></a>

###  MessageObjectName

**Ƭ MessageObjectName**: *"RC:TxtMsg" \| "RC:FileMsg" \| "RC:ImgMsg" \| `string`*

*Defined in [index.ts:234](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L234)*

___
<a id="publicservicemenuitem"></a>

###  PublicServiceMenuItem

**Ƭ PublicServiceMenuItem**: *`object`*

*Defined in [index.ts:965](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L965)*

公众服务菜单项

#### Type declaration

 id: `string`

 name: `string`

 type: [PublicServiceMenuItemType](../enums/rcimclient.publicservicemenuitemtype.md)

 url: `string`

___
<a id="searchconversationresult"></a>

###  SearchConversationResult

**Ƭ SearchConversationResult**: *`object`*

*Defined in [index.ts:478](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L478)*

#### Type declaration

 conversation: [Conversation](rcimclient.md#conversation)

 matchCount: `number`

___
<a id="sentmessage"></a>

###  SentMessage

**Ƭ SentMessage**: *`object`*

*Defined in [index.ts:221](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L221)*

#### Type declaration

 content: [TextMessage](rcimclient.md#textmessage)

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

 pushContent: `string`

 pushData: `string`

 targetId: `string`

___
<a id="sentmessagecallback"></a>

###  SentMessageCallback

**Ƭ SentMessageCallback**: *`object`*

*Defined in [index.ts:229](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L229)*

#### Type declaration

`Optional`  error: `function`

▸(errorCode: *[ErrorCode](../enums/rcimclient.errorcode.md)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| errorCode | [ErrorCode](../enums/rcimclient.errorcode.md) |

**Returns:** `void`

`Optional`  success: `function`

▸(messageId: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| messageId | `number` |

**Returns:** `void`

___
<a id="textmessage"></a>

###  TextMessage

**Ƭ TextMessage**: *`object`*

*Defined in [index.ts:128](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L128)*

#### Type declaration

 content: `string`

`Optional`  extra: `string`

 type: "text"

___

## Functions

<a id="addconnectionstatuslistener"></a>

###  addConnectionStatusListener

▸ **addConnectionStatusListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:366](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L366)*

添加消息监听函数

**Parameters:**

| Name | Type |
| ------ | ------ |
| listener | `function` |

**Returns:** `EmitterSubscription`

___
<a id="addmembertodiscussion"></a>

###  addMemberToDiscussion

▸ **addMemberToDiscussion**(targetId: *`string`*, userList: *`string`[]*): `Promise`<`void`>

*Defined in [index.ts:878](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L878)*

把用户加入讨论组

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |
| userList | `string`[] |  用户 ID 列表 |

**Returns:** `Promise`<`void`>

___
<a id="addreceivemessagelistener"></a>

###  addReceiveMessageListener

▸ **addReceiveMessageListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:215](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L215)*

添加消息监听函数

**Parameters:**

| Name | Type |
| ------ | ------ |
| listener | `function` |

**Returns:** `EmitterSubscription`

___
<a id="addtoblacklist"></a>

###  addToBlacklist

▸ **addToBlacklist**(userId: *`string`*): `Promise`<`void`>

*Defined in [index.ts:724](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L724)*

把用户加入黑名单

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| userId | `string` |  用户 ID |

**Returns:** `Promise`<`void`>

___
<a id="cleanremotehistorymessages"></a>

###  cleanRemoteHistoryMessages

▸ **cleanRemoteHistoryMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, sentTime: *`number`*): `Promise`<`boolean`>

*Defined in [index.ts:541](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L541)*

清除服务端历史消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| sentTime | `number` |  清除消息截止时间戳，为 0 则清除会话所有服务端历史消息 |

**Returns:** `Promise`<`boolean`>

___
<a id="clearmessages"></a>

###  clearMessages

▸ **clearMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<`boolean`>

*Defined in [index.ts:427](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L427)*

清空某一会话的所有消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  \- |
| targetId | `string` |   |

**Returns:** `Promise`<`boolean`>

___
<a id="clearmessagesunreadstatus"></a>

###  clearMessagesUnreadStatus

▸ **clearMessagesUnreadStatus**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, time?: *`number`*): `Promise`<`boolean`>

*Defined in [index.ts:711](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L711)*

清除某个会话中的未读消息数

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  会话类型 |
| targetId | `string` | - |  目标 ID |
| `Default value` time | `number` | 0 |  该会话已阅读的最后一条消息的发送时间戳 |

**Returns:** `Promise`<`boolean`>

___
<a id="connect"></a>

###  connect

▸ **connect**(token: *`string`*, success?: *`function`*, error?: *`function`*, tokenIncorrect?: *`function`*): `void`

*Defined in [index.ts:61](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L61)*

连接融云服务器，只需要调用一次

在 App 整个生命周期，您只需要调用一次此方法与融云服务器建立连接。 之后无论是网络出现异常或者App有前后台的切换等，SDK都会负责自动重连。 除非您已经手动将连接断开，否则您不需要自己再手动重连。

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| token | `string` | - |  从服务端获取的用户身份令牌（Token） |
| `Default value` success | `function` |  null |  成功回调函数 |
| `Default value` error | `function` |  null |  失败回调函数 |
| `Default value` tokenIncorrect | `function` |  null |  token 错误或过期回调函数 |

**Returns:** `void`

___
<a id="creatediscussion"></a>

###  createDiscussion

▸ **createDiscussion**(name: *`string`*, userList: *`string`[]*): `Promise`<`string`>

*Defined in [index.ts:839](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L839)*

创建讨论组

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  讨论组名称 |
| userList | `string`[] |  用户 ID 列表 |

**Returns:** `Promise`<`string`>

___
<a id="deletemessages"></a>

###  deleteMessages

▸ **deleteMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<`boolean`>

▸ **deleteMessages**(ids: *`number`[]*): `Promise`<`boolean`>

*Defined in [index.ts:440](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L440)*

删除某一会话的所有消息，同时清理数据库空间

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  \- |
| targetId | `string` |   |

**Returns:** `Promise`<`boolean`>

*Defined in [index.ts:450](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L450)*

根据消息 ID 删除消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ids | `number`[] |  消息 ID 列表 |

**Returns:** `Promise`<`boolean`>

___
<a id="deleteremotemessages"></a>

###  deleteRemoteMessages

▸ **deleteRemoteMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, messages: *[Message](rcimclient.md#message)[]*): `Promise`<`boolean`>

*Defined in [index.ts:556](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L556)*

清除服务端历史消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| messages | [Message](rcimclient.md#message)[] |  要删除的消息数组，数组大小不能超过 100 条 |

**Returns:** `Promise`<`boolean`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(isReceivePush?: *`boolean`*): `void`

*Defined in [index.ts:88](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L88)*

断开与融云服务器的连接

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` isReceivePush | `boolean` | true |  是否还接收推送 |

**Returns:** `void`

___
<a id="getblacklist"></a>

###  getBlacklist

▸ **getBlacklist**(): `Promise`<`string`[]>

*Defined in [index.ts:752](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L752)*

获取黑名单列表

**Returns:** `Promise`<`string`[]>
黑名单列表

___
<a id="getblackliststatus"></a>

###  getBlacklistStatus

▸ **getBlacklistStatus**(userId: *`string`*): `Promise`<`boolean`>

*Defined in [index.ts:743](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L743)*

获取某用户是否在黑名单中

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| userId | `string` |  用户 ID |

**Returns:** `Promise`<`boolean`>
是否在黑名单中

___
<a id="getchatroominfo"></a>

###  getChatRoomInfo

▸ **getChatRoomInfo**(targetId: *`string`*, memberCount?: *`number`*, order?: *[ChatRoomMemberOrder](../enums/rcimclient.chatroommemberorder.md)*): `Promise`<[ChatRoomInfo](rcimclient.md#chatroominfo)>

*Defined in [index.ts:825](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L825)*

获取聊天室信息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| targetId | `string` | - |  聊天室 ID |
| `Default value` memberCount | `number` | 20 |  聊天室成员数量，最多获取 20 个 |
| `Default value` order | [ChatRoomMemberOrder](../enums/rcimclient.chatroommemberorder.md) |  ChatRoomMemberOrder.ASC |  返回的聊天室成员排序方式 |

**Returns:** `Promise`<[ChatRoomInfo](rcimclient.md#chatroominfo)>

___
<a id="getconversation"></a>

###  getConversation

▸ **getConversation**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<[Conversation](rcimclient.md#conversation)>

*Defined in [index.ts:570](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L570)*

获取会话

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |

**Returns:** `Promise`<[Conversation](rcimclient.md#conversation)>

___
<a id="getconversationlist"></a>

###  getConversationList

▸ **getConversationList**(conversationTypes?: *[ConversationType](../enums/rcimclient.conversationtype.md)[]*): `Promise`<[Conversation](rcimclient.md#conversation)[]>

*Defined in [index.ts:582](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L582)*

获取会话列表

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` conversationTypes | [ConversationType](../enums/rcimclient.conversationtype.md)[] |  [] |  会话类型 |

**Returns:** `Promise`<[Conversation](rcimclient.md#conversation)[]>

___
<a id="getconversationnotificationstatus"></a>

###  getConversationNotificationStatus

▸ **getConversationNotificationStatus**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<[ConversationNotificationStatus](../enums/rcimclient.conversationnotificationstatus.md)>

*Defined in [index.ts:634](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L634)*

获取会话消息提醒状态

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |

**Returns:** `Promise`<[ConversationNotificationStatus](../enums/rcimclient.conversationnotificationstatus.md)>

___
<a id="getdiscussion"></a>

###  getDiscussion

▸ **getDiscussion**(targetId: *`string`*): `Promise`<[Discussion](rcimclient.md#discussion)>

*Defined in [index.ts:859](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L859)*

获取讨论组信息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |

**Returns:** `Promise`<[Discussion](rcimclient.md#discussion)>

___
<a id="gethistorymessages"></a>

###  getHistoryMessages

▸ **getHistoryMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, objectName?: *`string`*, oldestMessageId?: *`number`*, count?: *`number`*): `Promise`<[Message](rcimclient.md#message)[]>

*Defined in [index.ts:380](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L380)*

获取历史消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  会话类型 |
| targetId | `string` | - |  目标 ID |
| `Default value` objectName | `string` | &quot;&quot; |  消息对象名称，可以用 MessageObjectNames 获取消息类型对应的对象名称 |
| `Default value` oldestMessageId | `number` |  -1 |  最近一条消息的 ID |
| `Default value` count | `number` | 10 |  数量 |

**Returns:** `Promise`<[Message](rcimclient.md#message)[]>

___
<a id="getremotehistorymessages"></a>

###  getRemoteHistoryMessages

▸ **getRemoteHistoryMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, sentTime: *`number`*, count: *`number`*): `Promise`<[Message](rcimclient.md#message)[]>

*Defined in [index.ts:525](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L525)*

获取服务端历史消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| sentTime | `number` |  清除消息截止时间戳，为 0 则清除会话所有服务端历史消息 |
| count | `number` |  删除数量 |

**Returns:** `Promise`<[Message](rcimclient.md#message)[]>

___
<a id="gettextmessagedraft"></a>

###  getTextMessageDraft

▸ **getTextMessageDraft**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<`string`>

*Defined in [index.ts:662](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L662)*

获取某一会话的文本消息草稿

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |

**Returns:** `Promise`<`string`>

___
<a id="gettotalunreadcount"></a>

###  getTotalUnreadCount

▸ **getTotalUnreadCount**(): `Promise`<`number`>

*Defined in [index.ts:672](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L672)*

获取所有未读消息数

**Returns:** `Promise`<`number`>

___
<a id="getunreadcount"></a>

###  getUnreadCount

▸ **getUnreadCount**(conversationTypes: *[ConversationType](../enums/rcimclient.conversationtype.md)[]*): `Promise`<`number`>

▸ **getUnreadCount**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<`number`>

*Defined in [index.ts:681](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L681)*

获取指定会话的未读消息数

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationTypes | [ConversationType](../enums/rcimclient.conversationtype.md)[] |  会话类型列表 |

**Returns:** `Promise`<`number`>

*Defined in [index.ts:689](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L689)*

获取指定会话的未读消息数

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |

**Returns:** `Promise`<`number`>

___
<a id="init"></a>

###  init

▸ **init**(appKey: *`string`*): `void`

*Defined in [index.ts:22](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L22)*

初始化 SDK，只需要调用一次

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| appKey | `string` |  从融云开发者平台创建应用后获取到的 App Key |

**Returns:** `void`

___
<a id="insertoutgoingmessage"></a>

###  insertOutgoingMessage

▸ **insertOutgoingMessage**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, sentStatus: *[SentStatus](../enums/rcimclient.sentstatus.md)*, messageContent: *[MessageContent](rcimclient.md#messagecontent)*, sentTime?: *`number`*): `Promise`<[Message](rcimclient.md#message)>

*Defined in [index.ts:405](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L405)*

向本地会话插入一条发送消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  \- |
| targetId | `string` | - |  \- |
| sentStatus | [SentStatus](../enums/rcimclient.sentstatus.md) | - |  \- |
| messageContent | [MessageContent](rcimclient.md#messagecontent) | - |  \- |
| `Default value` sentTime | `number` | 0 |   |

**Returns:** `Promise`<[Message](rcimclient.md#message)>

___
<a id="joinchatroom"></a>

###  joinChatRoom

▸ **joinChatRoom**(targetId: *`string`*, messageCount?: *`number`*): `Promise`<`void`>

*Defined in [index.ts:762](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L762)*

加入聊天室，如果已存在，直接加入，否则创建并加入

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| targetId | `string` | - |  聊天室 ID |
| `Default value` messageCount | `number` | 10 |  默认获取的消息数量，最多 50 |

**Returns:** `Promise`<`void`>

___
<a id="joinexistchatroom"></a>

###  joinExistChatRoom

▸ **joinExistChatRoom**(targetId: *`string`*, messageCount?: *`number`*): `Promise`<`void`>

*Defined in [index.ts:772](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L772)*

加入已存在的聊天室，如果不存在则加入失败

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| targetId | `string` | - |  聊天室 ID |
| `Default value` messageCount | `number` | 10 |  默认获取的消息数量，最多 50 |

**Returns:** `Promise`<`void`>

___
<a id="quitchatroom"></a>

###  quitChatRoom

▸ **quitChatRoom**(targetId: *`string`*): `Promise`<`void`>

*Defined in [index.ts:781](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L781)*

退出聊天室

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  聊天室 ID |

**Returns:** `Promise`<`void`>

___
<a id="quitdiscussion"></a>

###  quitDiscussion

▸ **quitDiscussion**(targetId: *`string`*): `Promise`<`void`>

*Defined in [index.ts:868](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L868)*

退出讨论组

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |

**Returns:** `Promise`<`void`>

___
<a id="removeconversation"></a>

###  removeConversation

▸ **removeConversation**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<[Conversation](rcimclient.md#conversation)>

*Defined in [index.ts:594](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L594)*

从会话列表中移除某一会话，但是不删除会话内的消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |

**Returns:** `Promise`<[Conversation](rcimclient.md#conversation)>

___
<a id="removefromblacklist"></a>

###  removeFromBlacklist

▸ **removeFromBlacklist**(userId: *`string`*): `Promise`<`void`>

*Defined in [index.ts:733](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L733)*

把用户从黑名单种移除

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| userId | `string` |  用户 ID |

**Returns:** `Promise`<`void`>

___
<a id="removememberfromdiscussion"></a>

###  removeMemberFromDiscussion

▸ **removeMemberFromDiscussion**(targetId: *`string`*, user: *`string`*): `Promise`<`void`>

*Defined in [index.ts:888](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L888)*

把用户从讨论组移出

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |
| user | `string` |  用户 ID |

**Returns:** `Promise`<`void`>

___
<a id="savetextmessagedraft"></a>

###  saveTextMessageDraft

▸ **saveTextMessageDraft**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, content: *`string`*): `Promise`<`boolean`>

*Defined in [index.ts:648](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L648)*

保存某一会话的文本消息草稿

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| content | `string` |  草稿内容 |

**Returns:** `Promise`<`boolean`>

___
<a id="searchconversations"></a>

###  searchConversations

▸ **searchConversations**(keyword: *`string`*, conversationTypes: *[ConversationType](../enums/rcimclient.conversationtype.md)[]*, objectNames: *[MessageObjectName](rcimclient.md#messageobjectname)[]*): `Promise`<[SearchConversationResult](rcimclient.md#searchconversationresult)[]>

*Defined in [index.ts:490](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L490)*

根据关键字搜索会话

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| keyword | `string` |  关键字 |
| conversationTypes | [ConversationType](../enums/rcimclient.conversationtype.md)[] |  会话类型数组 |
| objectNames | [MessageObjectName](rcimclient.md#messageobjectname)[] |  对象名称数组 |

**Returns:** `Promise`<[SearchConversationResult](rcimclient.md#searchconversationresult)[]>

___
<a id="searchmessages"></a>

###  searchMessages

▸ **searchMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, keyword: *`string`*, count: *`number`*, startTime?: *`number`*): `Promise`<[Message](rcimclient.md#message)[]>

*Defined in [index.ts:507](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L507)*

搜索消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  \- |
| targetId | `string` | - |  \- |
| keyword | `string` | - |  \- |
| count | `number` | - |  \- |
| `Default value` startTime | `number` | 0 |   |

**Returns:** `Promise`<[Message](rcimclient.md#message)[]>

___
<a id="searchpublicservice"></a>

###  searchPublicService

▸ **searchPublicService**(keyword: *`string`*, searchType?: *[SearchType](../enums/rcimclient.searchtype.md)*, publicServiceType?: *[PublicServiceType](../enums/rcimclient.publicservicetype.md)*): `any`

*Defined in [index.ts:979](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L979)*

搜索公众服务

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| keyword | `string` | - |  关键字 |
| `Default value` searchType | [SearchType](../enums/rcimclient.searchtype.md) |  SearchType.FUZZY |  搜索类型 |
| `Default value` publicServiceType | [PublicServiceType](../enums/rcimclient.publicservicetype.md) | 0 |  公众服务类型 |

**Returns:** `any`

___
<a id="sendmessage"></a>

###  sendMessage

▸ **sendMessage**(message: *[SentMessage](rcimclient.md#sentmessage)*, callback?: *[SentMessageCallback](rcimclient.md#sentmessagecallback)*): `void`

*Defined in [index.ts:248](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L248)*

发送消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| message | [SentMessage](rcimclient.md#sentmessage) | - |  消息 |
| `Default value` callback | [SentMessageCallback](rcimclient.md#sentmessagecallback) |  null |  回调 |

**Returns:** `void`

___
<a id="setconversationnotificationstatus"></a>

###  setConversationNotificationStatus

▸ **setConversationNotificationStatus**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, notificationStatus: *[ConversationNotificationStatus](../enums/rcimclient.conversationnotificationstatus.md)*): `Promise`<[Conversation](rcimclient.md#conversation)>

*Defined in [index.ts:616](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L616)*

设置会话消息提醒状态

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| notificationStatus | [ConversationNotificationStatus](../enums/rcimclient.conversationnotificationstatus.md) |  会话提醒状态 |

**Returns:** `Promise`<[Conversation](rcimclient.md#conversation)>

___
<a id="setdevicetoken"></a>

###  setDeviceToken

▸ **setDeviceToken**(deviceToken: *`string`*): `void`

*Defined in [index.ts:35](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L35)*

设置 deviceToken，用于远程推送

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| deviceToken | `string` |  从系统获取到的设备号 deviceToken（需要去掉空格和尖括号）<br><br> deviceToken是系统提供的，从苹果服务器获取的，用于APNs远程推送必须使用的设备唯一值。 您需要将 \`-application:didRegisterForRemoteNotificationsWithDeviceToken:\` 获取到的deviceToken，转为NSString类型，并去掉其中的空格和尖括号，作为参数传入此方法。 |

**Returns:** `void`

___
<a id="setdiscussioninvitestatus"></a>

###  setDiscussionInviteStatus

▸ **setDiscussionInviteStatus**(targetId: *`string`*, isOpen: *`boolean`*): `Promise`<`void`>

*Defined in [index.ts:908](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L908)*

设置讨论组拉人权限

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |
| isOpen | `boolean` |  是否开放拉人权限 |

**Returns:** `Promise`<`void`>

___
<a id="setdiscussionname"></a>

###  setDiscussionName

▸ **setDiscussionName**(targetId: *`string`*, name: *`string`*): `Promise`<`void`>

*Defined in [index.ts:898](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L898)*

设置讨论组名称

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |
| name | `string` |  讨论组名称 |

**Returns:** `Promise`<`void`>

___
<a id="setserverinfo"></a>

###  setServerInfo

▸ **setServerInfo**(naviServer: *`string`*, fileServer: *`string`*): `void`

*Defined in [index.ts:45](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/c4be651/src/index.ts#L45)*

设置导航服务器和上传文件服务器信息，要在 [init](rcimclient.md#init) 前使用

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| naviServer | `string` |  导航服务器地址 |
| fileServer | `string` |  文件服务器地址 |

**Returns:** `void`

___

