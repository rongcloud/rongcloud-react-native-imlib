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
* [CommandMessage](rcimclient.md#commandmessage)
* [ConnectionStatus](rcimclient.md#connectionstatus)
* [Conversation](rcimclient.md#conversation)
* [Discussion](rcimclient.md#discussion)
* [FileMessage](rcimclient.md#filemessage)
* [GroupNotificationMessage](rcimclient.md#groupnotificationmessage)
* [ImageMessage](rcimclient.md#imagemessage)
* [LocationMessage](rcimclient.md#locationmessage)
* [MemberInfo](rcimclient.md#memberinfo)
* [Message](rcimclient.md#message-1)
* [MessageContent](rcimclient.md#messagecontent)
* [MessageObjectName](rcimclient.md#messageobjectname)
* [PublicServiceMenuItem](rcimclient.md#publicservicemenuitem)
* [PublicServiceProfile](rcimclient.md#publicserviceprofile)
* [ReceiptRequest](rcimclient.md#receiptrequest)
* [ReceiptResponse](rcimclient.md#receiptresponse)
* [SearchConversationResult](rcimclient.md#searchconversationresult)
* [SentMessage](rcimclient.md#sentmessage)
* [SentMessageCallback](rcimclient.md#sentmessagecallback)
* [TextMessage](rcimclient.md#textmessage)
* [TypingStatus](rcimclient.md#typingstatus)
* [VoiceMessage](rcimclient.md#voicemessage)

### Functions

* [addConnectionStatusListener](rcimclient.md#addconnectionstatuslistener)
* [addMemberToDiscussion](rcimclient.md#addmembertodiscussion)
* [addReadReceiptReceivedListener](rcimclient.md#addreadreceiptreceivedlistener)
* [addReceiptRequestListener](rcimclient.md#addreceiptrequestlistener)
* [addReceiptResponseListener](rcimclient.md#addreceiptresponselistener)
* [addReceiveMessageListener](rcimclient.md#addreceivemessagelistener)
* [addToBlacklist](rcimclient.md#addtoblacklist)
* [addTypingStatusListener](rcimclient.md#addtypingstatuslistener)
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
* [getPublicServiceList](rcimclient.md#getpublicservicelist)
* [getPublicServiceProfile](rcimclient.md#getpublicserviceprofile)
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
* [recallMessage](rcimclient.md#recallmessage)
* [removeConversation](rcimclient.md#removeconversation)
* [removeFromBlacklist](rcimclient.md#removefromblacklist)
* [removeMemberFromDiscussion](rcimclient.md#removememberfromdiscussion)
* [saveTextMessageDraft](rcimclient.md#savetextmessagedraft)
* [searchConversations](rcimclient.md#searchconversations)
* [searchMessages](rcimclient.md#searchmessages)
* [searchPublicService](rcimclient.md#searchpublicservice)
* [sendMessage](rcimclient.md#sendmessage)
* [sendReadReceiptMessage](rcimclient.md#sendreadreceiptmessage)
* [sendReadReceiptRequest](rcimclient.md#sendreadreceiptrequest)
* [sendTypingStatus](rcimclient.md#sendtypingstatus)
* [setConversationNotificationStatus](rcimclient.md#setconversationnotificationstatus)
* [setDeviceToken](rcimclient.md#setdevicetoken)
* [setDiscussionInviteStatus](rcimclient.md#setdiscussioninvitestatus)
* [setDiscussionName](rcimclient.md#setdiscussionname)
* [setServerInfo](rcimclient.md#setserverinfo)
* [subscribePublicService](rcimclient.md#subscribepublicservice)
* [unsubscribePublicService](rcimclient.md#unsubscribepublicservice)

---

## Type aliases

<a id="chatroominfo"></a>

###  ChatRoomInfo

**Ƭ ChatRoomInfo**: *`object`*

*Defined in [index.ts:1040](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1040)*

聊天室信息

#### Type declaration

 memberOrder: [ChatRoomMemberOrder](../enums/rcimclient.chatroommemberorder.md)

 members: [MemberInfo](rcimclient.md#memberinfo)[]

 targetId: `string`

 totalMemberCount: `number`

___
<a id="commandmessage"></a>

###  CommandMessage

**Ƭ CommandMessage**: *`object`*

*Defined in [index.ts:187](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L187)*

命令消息

#### Type declaration

 data: `string`

 name: `string`

 type: "command"

___
<a id="connectionstatus"></a>

###  ConnectionStatus

**Ƭ ConnectionStatus**: *[ConnectionStatusIOS](../enums/rcimclient.connectionstatusios.md) \| [ConnectionStatusAndroid](../enums/rcimclient.connectionstatusandroid.md)*

*Defined in [index.ts:590](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L590)*

连接状态

___
<a id="conversation"></a>

###  Conversation

**Ƭ Conversation**: *`object`*

*Defined in [index.ts:691](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L691)*

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

*Defined in [index.ts:1075](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1075)*

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

*Defined in [index.ts:152](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L152)*

文件消息

#### Type declaration

`Optional`  extra: `string`

`Optional`  fileType: `string`

 local: `string`

`Optional`  name: `string`

`Optional`  remote: `string`

`Optional`  size: `number`

 type: "file"

___
<a id="groupnotificationmessage"></a>

###  GroupNotificationMessage

**Ƭ GroupNotificationMessage**: *`object`*

*Defined in [index.ts:196](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L196)*

群组通知消息

#### Type declaration

 data: `string`

操作数据

 extra: `string`

额外数据

 message: `string`

消息内容

 operation: `string`

群组通知的操作名称

 operatorUserId: `string`

操作者 ID

 type: "group-notification"

___
<a id="imagemessage"></a>

###  ImageMessage

**Ƭ ImageMessage**: *`object`*

*Defined in [index.ts:140](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L140)*

图片消息

#### Type declaration

`Optional`  extra: `string`

`Optional`  isFull: `string`

 local: `string`

`Optional`  remote: `string`

`Optional`  thumbnail: `string`

 type: "image"

___
<a id="locationmessage"></a>

###  LocationMessage

**Ƭ LocationMessage**: *`object`*

*Defined in [index.ts:165](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L165)*

位置消息

#### Type declaration

`Optional`  extra: `string`

 latitude: `number`

 longitude: `number`

 name: `string`

`Optional`  thumbnail: `string`

 type: "location"

___
<a id="memberinfo"></a>

###  MemberInfo

**Ƭ MemberInfo**: *`object`*

*Defined in [index.ts:1032](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1032)*

聊天室成员信息

#### Type declaration

 joinTime: `number`

 userId: `string`

___
<a id="message-1"></a>

###  Message

**Ƭ Message**: *`object`*

*Defined in [index.ts:238](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L238)*

消息

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

**Ƭ MessageContent**: *[TextMessage](rcimclient.md#textmessage) \| [ImageMessage](rcimclient.md#imagemessage) \| [FileMessage](rcimclient.md#filemessage) \| [LocationMessage](rcimclient.md#locationmessage) \| [VoiceMessage](rcimclient.md#voicemessage)*

*Defined in [index.ts:228](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L228)*

消息内容

___
<a id="messageobjectname"></a>

###  MessageObjectName

**Ƭ MessageObjectName**: *"RC:TxtMsg" \| "RC:FileMsg" \| "RC:ImgMsg" \| "RC:LBSMsg" \| "RC:VcMsg" \| `string`*

*Defined in [index.ts:343](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L343)*

消息对象名称

___
<a id="publicservicemenuitem"></a>

###  PublicServiceMenuItem

**Ƭ PublicServiceMenuItem**: *`object`*

*Defined in [index.ts:1194](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1194)*

公众服务菜单项

#### Type declaration

 id: `string`

菜单项 ID

 name: `string`

菜单项名称

 type: [PublicServiceMenuItemType](../enums/rcimclient.publicservicemenuitemtype.md)

菜单项类型

 url: `string`

菜单项 URL

___
<a id="publicserviceprofile"></a>

###  PublicServiceProfile

**Ƭ PublicServiceProfile**: *`object`*

*Defined in [index.ts:1219](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1219)*

公众服务描述

#### Type declaration

 followed: `boolean`

用户是否已关注

 id: `string`

 introduction: `string`

服务描述

 isGlobal: `boolean`

是否设置为所有用户均关注

 menu: [PublicServiceMenuItem](rcimclient.md#publicservicemenuitem)[]

菜单

 name: `string`

服务名称

 portraitUrl: `string`

头像连接

 type: [PublicServiceType](../enums/rcimclient.publicservicetype.md) \| [ConversationType](../enums/rcimclient.conversationtype.md)

类型

___
<a id="receiptrequest"></a>

###  ReceiptRequest

**Ƭ ReceiptRequest**: *`object`*

*Defined in [index.ts:461](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L461)*

#### Type declaration

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

 messageUId: `string`

 targetId: `string`

___
<a id="receiptresponse"></a>

###  ReceiptResponse

**Ƭ ReceiptResponse**: *`object`*

*Defined in [index.ts:476](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L476)*

#### Type declaration

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

 messageUId: `string`

 targetId: `string`

 users: `object`

[key: `string`]: `number`

___
<a id="searchconversationresult"></a>

###  SearchConversationResult

**Ƭ SearchConversationResult**: *`object`*

*Defined in [index.ts:707](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L707)*

#### Type declaration

 conversation: [Conversation](rcimclient.md#conversation)

 matchCount: `number`

___
<a id="sentmessage"></a>

###  SentMessage

**Ƭ SentMessage**: *`object`*

*Defined in [index.ts:305](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L305)*

要发送的消息

#### Type declaration

 content: [TextMessage](rcimclient.md#textmessage)

消息内容

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

会话类型

 pushContent: `string`

推送内容，用于显示

 pushData: `string`

推送数据，不显示

 targetId: `string`

目标 ID

___
<a id="sentmessagecallback"></a>

###  SentMessageCallback

**Ƭ SentMessageCallback**: *`object`*

*Defined in [index.ts:335](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L335)*

发送消息回调

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

*Defined in [index.ts:131](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L131)*

文本消息

#### Type declaration

 content: `string`

`Optional`  extra: `string`

 type: "text"

___
<a id="typingstatus"></a>

###  TypingStatus

**Ƭ TypingStatus**: *`object`*

*Defined in [index.ts:415](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L415)*

输入状态

#### Type declaration

 conversationType: [ConversationType](../enums/rcimclient.conversationtype.md)

 sentTime: `number`

 targetId: `string`

 typingContentType: `string`

 userId: `string`

___
<a id="voicemessage"></a>

###  VoiceMessage

**Ƭ VoiceMessage**: *`object`*

*Defined in [index.ts:177](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L177)*

语音消息

#### Type declaration

 data: `string`

 duration: `number`

 local: `string`

 type: "voice"

___

## Functions

<a id="addconnectionstatuslistener"></a>

###  addConnectionStatusListener

▸ **addConnectionStatusListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:595](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L595)*

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

*Defined in [index.ts:1107](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1107)*

把用户加入讨论组

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |
| userList | `string`[] |  用户 ID 列表 |

**Returns:** `Promise`<`void`>

___
<a id="addreadreceiptreceivedlistener"></a>

###  addReadReceiptReceivedListener

▸ **addReadReceiptReceivedListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:457](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L457)*

添加私聊阅读回执监听函数

**Parameters:**

| Name | Type |
| ------ | ------ |
| listener | `function` |

**Returns:** `EmitterSubscription`

___
<a id="addreceiptrequestlistener"></a>

###  addReceiptRequestListener

▸ **addReceiptRequestListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:472](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L472)*

添加收到消息已读回执请求监听函数

收到此请求后，如果用户阅读了对应的消息，需要调用 sendMessageReadReceiptResponse 接口发送已读响应

**Parameters:**

| Name | Type |
| ------ | ------ |
| listener | `function` |

**Returns:** `EmitterSubscription`

___
<a id="addreceiptresponselistener"></a>

###  addReceiptResponseListener

▸ **addReceiptResponseListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:483](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L483)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| listener | `function` |

**Returns:** `EmitterSubscription`

___
<a id="addreceivemessagelistener"></a>

###  addReceiveMessageListener

▸ **addReceiveMessageListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:298](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L298)*

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

*Defined in [index.ts:953](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L953)*

把用户加入黑名单

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| userId | `string` |  用户 ID |

**Returns:** `Promise`<`void`>

___
<a id="addtypingstatuslistener"></a>

###  addTypingStatusListener

▸ **addTypingStatusListener**(listener: *`function`*): `EmitterSubscription`

*Defined in [index.ts:426](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L426)*

添加输入状态监听函数

**Parameters:**

| Name | Type |
| ------ | ------ |
| listener | `function` |

**Returns:** `EmitterSubscription`

___
<a id="cleanremotehistorymessages"></a>

###  cleanRemoteHistoryMessages

▸ **cleanRemoteHistoryMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, sentTime: *`number`*): `Promise`<`boolean`>

*Defined in [index.ts:770](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L770)*

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

*Defined in [index.ts:656](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L656)*

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

*Defined in [index.ts:940](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L940)*

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

*Defined in [index.ts:61](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L61)*

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

*Defined in [index.ts:1068](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1068)*

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

*Defined in [index.ts:669](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L669)*

删除某一会话的所有消息，同时清理数据库空间

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  \- |
| targetId | `string` |   |

**Returns:** `Promise`<`boolean`>

*Defined in [index.ts:679](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L679)*

根据消息 ID 删除消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ids | `number`[] |  消息 ID 列表 |

**Returns:** `Promise`<`boolean`>

___
<a id="deleteremotemessages"></a>

###  deleteRemoteMessages

▸ **deleteRemoteMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, messages: *[Message](rcimclient.md#message-1)[]*): `Promise`<`boolean`>

*Defined in [index.ts:785](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L785)*

清除服务端历史消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| messages | [Message](rcimclient.md#message-1)[] |  要删除的消息数组，数组大小不能超过 100 条 |

**Returns:** `Promise`<`boolean`>

___
<a id="disconnect"></a>

###  disconnect

▸ **disconnect**(isReceivePush?: *`boolean`*): `void`

*Defined in [index.ts:88](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L88)*

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

*Defined in [index.ts:981](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L981)*

获取黑名单列表

**Returns:** `Promise`<`string`[]>
黑名单列表

___
<a id="getblackliststatus"></a>

###  getBlacklistStatus

▸ **getBlacklistStatus**(userId: *`string`*): `Promise`<`boolean`>

*Defined in [index.ts:972](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L972)*

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

*Defined in [index.ts:1054](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1054)*

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

*Defined in [index.ts:799](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L799)*

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

*Defined in [index.ts:811](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L811)*

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

*Defined in [index.ts:863](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L863)*

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

*Defined in [index.ts:1088](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1088)*

获取讨论组信息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |

**Returns:** `Promise`<[Discussion](rcimclient.md#discussion)>

___
<a id="gethistorymessages"></a>

###  getHistoryMessages

▸ **getHistoryMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, objectName?: *`string`*, oldestMessageId?: *`number`*, count?: *`number`*): `Promise`<[Message](rcimclient.md#message-1)[]>

*Defined in [index.ts:609](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L609)*

获取历史消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  会话类型 |
| targetId | `string` | - |  目标 ID |
| `Default value` objectName | `string` | &quot;&quot; |  消息对象名称，可以用 MessageObjectNames 获取消息类型对应的对象名称 |
| `Default value` oldestMessageId | `number` |  -1 |  最近一条消息的 ID |
| `Default value` count | `number` | 10 |  数量 |

**Returns:** `Promise`<[Message](rcimclient.md#message-1)[]>

___
<a id="getpublicservicelist"></a>

###  getPublicServiceList

▸ **getPublicServiceList**(): `Promise`<[PublicServiceProfile](rcimclient.md#publicserviceprofile)[]>

*Defined in [index.ts:1302](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1302)*

获取已订阅的公众服务列表

**Returns:** `Promise`<[PublicServiceProfile](rcimclient.md#publicserviceprofile)[]>

___
<a id="getpublicserviceprofile"></a>

###  getPublicServiceProfile

▸ **getPublicServiceProfile**(publicServiceType: *[PublicServiceType](../enums/rcimclient.publicservicetype.md)*, publicServiceId: *`string`*): `Promise`<[PublicServiceProfile](rcimclient.md#publicserviceprofile)>

*Defined in [index.ts:1312](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1312)*

获取单个公众服务信息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| publicServiceType | [PublicServiceType](../enums/rcimclient.publicservicetype.md) |  公共服务类型 |
| publicServiceId | `string` |  公共服务 ID |

**Returns:** `Promise`<[PublicServiceProfile](rcimclient.md#publicserviceprofile)>

___
<a id="getremotehistorymessages"></a>

###  getRemoteHistoryMessages

▸ **getRemoteHistoryMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, sentTime: *`number`*, count: *`number`*): `Promise`<[Message](rcimclient.md#message-1)[]>

*Defined in [index.ts:754](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L754)*

获取服务端历史消息

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| sentTime | `number` |  清除消息截止时间戳，为 0 则清除会话所有服务端历史消息 |
| count | `number` |  删除数量 |

**Returns:** `Promise`<[Message](rcimclient.md#message-1)[]>

___
<a id="gettextmessagedraft"></a>

###  getTextMessageDraft

▸ **getTextMessageDraft**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<`string`>

*Defined in [index.ts:891](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L891)*

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

*Defined in [index.ts:901](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L901)*

获取所有未读消息数

**Returns:** `Promise`<`number`>

___
<a id="getunreadcount"></a>

###  getUnreadCount

▸ **getUnreadCount**(conversationTypes: *[ConversationType](../enums/rcimclient.conversationtype.md)[]*): `Promise`<`number`>

▸ **getUnreadCount**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<`number`>

*Defined in [index.ts:910](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L910)*

获取指定会话的未读消息数

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationTypes | [ConversationType](../enums/rcimclient.conversationtype.md)[] |  会话类型列表 |

**Returns:** `Promise`<`number`>

*Defined in [index.ts:918](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L918)*

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

*Defined in [index.ts:22](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L22)*

初始化 SDK，只需要调用一次

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| appKey | `string` |  从融云开发者平台创建应用后获取到的 App Key |

**Returns:** `void`

___
<a id="insertoutgoingmessage"></a>

###  insertOutgoingMessage

▸ **insertOutgoingMessage**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, sentStatus: *[SentStatus](../enums/rcimclient.sentstatus.md)*, messageContent: *[MessageContent](rcimclient.md#messagecontent)*, sentTime?: *`number`*): `Promise`<[Message](rcimclient.md#message-1)>

*Defined in [index.ts:634](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L634)*

向本地会话插入一条发送消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  \- |
| targetId | `string` | - |  \- |
| sentStatus | [SentStatus](../enums/rcimclient.sentstatus.md) | - |  \- |
| messageContent | [MessageContent](rcimclient.md#messagecontent) | - |  \- |
| `Default value` sentTime | `number` | 0 |   |

**Returns:** `Promise`<[Message](rcimclient.md#message-1)>

___
<a id="joinchatroom"></a>

###  joinChatRoom

▸ **joinChatRoom**(targetId: *`string`*, messageCount?: *`number`*): `Promise`<`void`>

*Defined in [index.ts:991](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L991)*

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

*Defined in [index.ts:1001](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1001)*

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

*Defined in [index.ts:1010](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1010)*

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

*Defined in [index.ts:1097](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1097)*

退出讨论组

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| targetId | `string` |  讨论组 ID |

**Returns:** `Promise`<`void`>

___
<a id="recallmessage"></a>

###  recallMessage

▸ **recallMessage**(messageId: *`number`*, pushContent: *`string`*): `Promise`<`void`>

*Defined in [index.ts:393](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L393)*

消息撤回

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| messageId | `number` |  消息 ID |
| pushContent | `string` |  推送内容 |

**Returns:** `Promise`<`void`>

___
<a id="removeconversation"></a>

###  removeConversation

▸ **removeConversation**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*): `Promise`<[Conversation](rcimclient.md#conversation)>

*Defined in [index.ts:823](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L823)*

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

*Defined in [index.ts:962](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L962)*

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

*Defined in [index.ts:1117](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1117)*

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

*Defined in [index.ts:877](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L877)*

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

*Defined in [index.ts:719](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L719)*

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

▸ **searchMessages**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, keyword: *`string`*, count: *`number`*, startTime?: *`number`*): `Promise`<[Message](rcimclient.md#message-1)[]>

*Defined in [index.ts:736](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L736)*

搜索消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) | - |  \- |
| targetId | `string` | - |  \- |
| keyword | `string` | - |  \- |
| count | `number` | - |  \- |
| `Default value` startTime | `number` | 0 |   |

**Returns:** `Promise`<[Message](rcimclient.md#message-1)[]>

___
<a id="searchpublicservice"></a>

###  searchPublicService

▸ **searchPublicService**(keyword: *`string`*, searchType?: *[SearchType](../enums/rcimclient.searchtype.md)*, publicServiceType?: *[PublicServiceType](../enums/rcimclient.publicservicetype.md)*): `Promise`<[PublicServiceProfile](rcimclient.md#publicserviceprofile)[]>

*Defined in [index.ts:1265](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1265)*

搜索公众服务

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| keyword | `string` | - |  关键字 |
| `Default value` searchType | [SearchType](../enums/rcimclient.searchtype.md) |  SearchType.FUZZY |  搜索类型 |
| `Default value` publicServiceType | [PublicServiceType](../enums/rcimclient.publicservicetype.md) | 0 |  公众服务类型 |

**Returns:** `Promise`<[PublicServiceProfile](rcimclient.md#publicserviceprofile)[]>

___
<a id="sendmessage"></a>

###  sendMessage

▸ **sendMessage**(message: *[SentMessage](rcimclient.md#sentmessage)*, callback?: *[SentMessageCallback](rcimclient.md#sentmessagecallback)*): `void`

*Defined in [index.ts:368](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L368)*

发送消息

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| message | [SentMessage](rcimclient.md#sentmessage) | - |  消息 |
| `Default value` callback | [SentMessageCallback](rcimclient.md#sentmessagecallback) |  null |  回调 |

**Returns:** `void`

___
<a id="sendreadreceiptmessage"></a>

###  sendReadReceiptMessage

▸ **sendReadReceiptMessage**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, timestamp: *`number`*): `void`

*Defined in [index.ts:437](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L437)*

发送阅读回执

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| timestamp | `number` |  该会话中已阅读点最后一条消息的发送时间戳 |

**Returns:** `void`

___
<a id="sendreadreceiptrequest"></a>

###  sendReadReceiptRequest

▸ **sendReadReceiptRequest**(messageId: *`number`*): `Promise`<`void`>

*Defined in [index.ts:450](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L450)*

发起群组消息回执请求

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| messageId | `number` |  消息 ID |

**Returns:** `Promise`<`void`>

___
<a id="sendtypingstatus"></a>

###  sendTypingStatus

▸ **sendTypingStatus**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, typingContentType: *`string`*): `void`

*Defined in [index.ts:404](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L404)*

发送输入状态

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| conversationType | [ConversationType](../enums/rcimclient.conversationtype.md) |  会话类型 |
| targetId | `string` |  目标 ID |
| typingContentType | `string` |  输入内容类型 |

**Returns:** `void`

___
<a id="setconversationnotificationstatus"></a>

###  setConversationNotificationStatus

▸ **setConversationNotificationStatus**(conversationType: *[ConversationType](../enums/rcimclient.conversationtype.md)*, targetId: *`string`*, notificationStatus: *[ConversationNotificationStatus](../enums/rcimclient.conversationnotificationstatus.md)*): `Promise`<[Conversation](rcimclient.md#conversation)>

*Defined in [index.ts:845](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L845)*

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

*Defined in [index.ts:35](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L35)*

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

*Defined in [index.ts:1137](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1137)*

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

*Defined in [index.ts:1127](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1127)*

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

*Defined in [index.ts:45](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L45)*

设置导航服务器和上传文件服务器信息，要在 [init](rcimclient.md#init) 前使用

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| naviServer | `string` |  导航服务器地址 |
| fileServer | `string` |  文件服务器地址 |

**Returns:** `void`

___
<a id="subscribepublicservice"></a>

###  subscribePublicService

▸ **subscribePublicService**(publicServiceType: *[PublicServiceType](../enums/rcimclient.publicservicetype.md)*, publicServiceId: *`string`*): `Promise`<`void`>

*Defined in [index.ts:1279](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1279)*

订阅公共服务

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| publicServiceType | [PublicServiceType](../enums/rcimclient.publicservicetype.md) |  公共服务类型 |
| publicServiceId | `string` |  公共服务 ID |

**Returns:** `Promise`<`void`>

___
<a id="unsubscribepublicservice"></a>

###  unsubscribePublicService

▸ **unsubscribePublicService**(publicServiceType: *[PublicServiceType](../enums/rcimclient.publicservicetype.md)*, publicServiceId: *`string`*): `Promise`<`void`>

*Defined in [index.ts:1292](https://github.com/rongcloud/rongcloud-react-native-imlib/blob/2913ce2/src/index.ts#L1292)*

取消关注公共服务

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| publicServiceType | [PublicServiceType](../enums/rcimclient.publicservicetype.md) |  公共服务类型 |
| publicServiceId | `string` |  公共服务 ID |

**Returns:** `Promise`<`void`>

___

