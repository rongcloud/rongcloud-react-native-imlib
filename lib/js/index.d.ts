import { ConnectionStatus, ConversationType, ErrorCode, Message, ObjectName, PublicServiceType, RecallNotificationMessage, ReceiptRequest, ReceiveMessage, SentMessage, TypingStatus, ConnectErrorCode, Conversation, MessageContent, PublicServiceProfile, ReceiptResponse, SearchType, SentStatus, SearchConversationResult, TimestampOrder, ChatRoomMemberOrder, ChatRoomInfo, Discussion, RealTimeLocationStatus, CSConfig, CSMode, CSGroupItem, CSInfo, CSResolveStatus, CSLeaveMessageItem, PushLanguage, PushNotificationMessage } from "./types";
export * from "./types";
/**
 * 初始化 SDK，只需要调用一次
 *
 * @param appKey 从融云开发者平台创建应用后获取到的 App Key
 */
export declare function init(appKey: string): void;
/**
 * 添加日志信息监听函数
 *
 * @param listener
 */
export declare function addLogInfoListener(listener: (logInfo: string) => void): any;
/**
 * 添加消息撤回监听函数
 *
 * @param listener
 */
export declare function addRecallMessageListener(listener: (messageId: string) => void): any;
/**
 * 同步会话阅读状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param timestamp 该会话中已读的最后一条消息的发送时间戳
 */
export declare function syncConversationReadStatus(conversationType: ConversationType, targetId: string, timestamp: number): Promise<void>;
/**
 * 设置 deviceToken，用于远程推送
 *
 * @param deviceToken 从系统获取到的设备号 deviceToken（需要去掉空格和尖括号）
 *
 *   deviceToken是系统提供的，从苹果服务器获取的，用于APNs远程推送必须使用的设备唯一值。
 *   您需要将 `-application:didRegisterForRemoteNotificationsWithDeviceToken:`
 *   获取到的deviceToken，转为NSString类型，并去掉其中的空格和尖括号，作为参数传入此方法。
 */
export declare function setDeviceToken(deviceToken: string): void;
/**
 * 设置导航服务器和上传文件服务器信息，要在 [[init]] 前使用
 *
 * @param naviServer 导航服务器地址
 * @param fileServer 文件服务器地址
 */
export declare function setServerInfo(naviServer: string, fileServer: string): void;
/**
 * 设置统计服务地址
 *
 * 配置数据上传地址 (非必须) 通过配置该地址，SDK
 * 会在初始化时把设备相关信息上传到私有云节点。
 * 影响到的功能是开发者后台的广播推送功能，如果私有云客户没有配置该地址，那从后台发推送时，客户端是收不到的。
 * 普通的 IM 推送不受影响。设置数据上传服务器地址。
 * 可以支持设置 http://cn.xxx.com 或者 https://cn.xxx.com 或者 cn.xxx.com
 * 如果设置成 cn.xxx.com，sdk 会组装成并仅支持 http:// 协议格式。
 *
 * @param server 服务地址
 */
export declare function setStatisticServer(server: string): void;
/**
 * 连接融云服务器，只需要调用一次
 *
 * 在 App 整个生命周期，您只需要调用一次此方法与融云服务器建立连接。
 * 之后无论是网络出现异常或者App有前后台的切换等，SDK都会负责自动重连。
 * 除非您已经手动将连接断开，否则您不需要自己再手动重连。
 *
 * @param token 从服务端获取的用户身份令牌（Token）
 * @param success 成功回调函数
 * @param error 失败回调函数
 * @param tokenIncorrect token 错误或过期回调函数
 */
export declare function connect(token: string, success?: (userId: string) => void, error?: (errorCode: ConnectErrorCode) => void, tokenIncorrect?: () => void): void;
/**
 * 断开与融云服务器的连接
 *
 * @param isReceivePush 是否还接收推送
 */
export declare function disconnect(isReceivePush?: boolean): void;
/**
 * 获取当前连接状态
 */
export declare function getConnectionStatus(): Promise<ConnectionStatus>;
/**
 * 添加消息监听函数
 */
export declare function addReceiveMessageListener(listener: (message: ReceiveMessage) => void): any;
/**
 * 发送消息回调
 */
export interface SentMessageCallback {
    success?: (messageId: number) => void;
    progress?: (progress: number, messageId: number) => void;
    cancel?: () => void;
    error?: (errorCode: ErrorCode, messageId: number, errorMessage?: string) => void;
}
/**
 * 发送消息
 *
 * @param message 消息
 * @param callback 回调
 */
export declare function sendMessage(message: SentMessage, callback?: SentMessageCallback): void;
/**
 * 发送媒体消息
 *
 * @param message 消息
 * @param callback 回调
 */
export declare function sendMediaMessage(message: SentMessage, callback?: SentMessageCallback): void;
/**
 * 发送定向消息
 *
 * @param message 消息
 * @param userIdList 用户 ID 列表
 * @param callback 回调
 */
export declare function sendDirectionalMessage(message: SentMessage, userIdList: string[], callback: SentMessageCallback): void;
/**
 * 消息撤回
 *
 * @param messageId 消息 ID
 * @param pushContent 推送内容
 */
export declare function recallMessage(messageId: number, pushContent?: string): Promise<RecallNotificationMessage>;
/**
 * 发送输入状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param typingContentType 输入内容类型
 */
export declare function sendTypingStatus(conversationType: ConversationType, targetId: string, typingContentType: string): void;
/**
 * 添加输入状态监听函数
 */
export declare function addTypingStatusListener(listener: (status: TypingStatus) => void): any;
/**
 * 设置消息发送状态
 *
 * @param messageId 消息 ID
 * @param status 状态
 */
export declare function setMessageSentStatus(messageId: number, status: SentStatus): Promise<void>;
/**
 * 设置消息接收状态
 *
 * @param messageId 消息 ID
 * @param status 状态
 */
export declare function setMessageReceivedStatus(messageId: number, status: number): Promise<void>;
/**
 * 获取屏蔽消息提醒的会话列表
 *
 * @param conversationTypeList 消息类型列表
 */
export declare function getBlockedConversationList(conversationTypeList: ConversationType[]): Promise<Conversation[]>;
/**
 * 发送阅读回执
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param timestamp 该会话中已阅读点最后一条消息的发送时间戳
 */
export declare function sendReadReceiptMessage(conversationType: ConversationType, targetId: string, timestamp: number): void;
/**
 * 发起群组消息回执请求
 *
 * @param messageId 消息 ID
 */
export declare function sendReadReceiptRequest(messageId: number): Promise<void>;
/**
 * 发起群组消息回执响应
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param messages 回执的消息列表
 */
export declare function sendReadReceiptResponse(conversationType: ConversationType, targetId: string, messages: Message[]): Promise<void>;
/**
 * 添加私聊阅读回执监听函数
 */
export declare function addReadReceiptReceivedListener(listener: (message: Message) => void): any;
/**
 * 添加收到消息已读回执请求监听函数
 *
 * 收到此请求后，如果用户阅读了对应的消息，需要调用
 * sendMessageReadReceiptResponse 接口发送已读响应
 */
export declare function addReceiptRequestListener(listener: (data: ReceiptRequest) => void): any;
/**
 * 添加消息回执响应监听函数
 *
 * @param listener
 */
export declare function addReceiptResponseListener(listener: (data: ReceiptResponse) => void): any;
/**
 * 取消发送中的媒体消息
 *
 * @param messageId 消息 ID
 */
export declare function cancelSendMediaMessage(messageId: number): Promise<void>;
/**
 * 取消下载中的媒体消息
 *
 * @param messageId 消息 ID
 */
export declare function cancelDownloadMediaMessage(messageId: number): Promise<void>;
export interface MediaMessageCallback {
    progress?: (progress: number) => void;
    success?: (path: string) => void;
    error?: (errorCode: number) => void;
    cancel?: () => void;
}
/**
 * 下载媒体消息
 *
 * @param messageId 消息 ID
 * @param callback 回调
 */
export declare function downloadMediaMessage(messageId: number, callback?: MediaMessageCallback): void;
/**
 * 添加连接状态监听函数
 */
export declare function addConnectionStatusListener(listener: (status: ConnectionStatus) => void): any;
/**
 * 设置断线重连时是否踢出重连设备
 *
 * 用户没有开通多设备登录功能的前提下，同一个账号在一台新设备上登录的时候，会把这个账号在之前登录的设备上踢出。
 * 由于 SDK 有断线重连功能，存在下面情况。 用户在 A 设备登录，A
 * 设备网络不稳定，没有连接成功，SDK 启动重连机制。 用户此时又在 B 设备登录，B
 * 设备连接成功。 A 设备网络稳定之后，用户在 A 设备连接成功，B 设备被踢出。
 * 这个接口就是为这种情况加的。 设置 enable 为 true 时，SDK
 * 重连的时候发现此时已有别的设备连接成功，不再强行踢出已有设备，而是踢出重连设备。
 *
 * @param enabled 是否踢出重连设备
 */
export declare function setReconnectKickEnable(enabled: boolean): void;
/**
 * 获取历史消息
 *
 * 此方法会获取该会话中，timestamp 之前或之后的、指定数量、指定消息类型（多个）的消息实体列表，返回的消息实体按照时间从新到旧排列。
 * 返回的消息中不包含 timestamp 对应的那条消息，如果会话中的消息数量小于参数 count 的值，会将该会话中的所有消息返回。
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param objectNames 对象名称数组，仅当该参数为数组时调用该方法
 * @param timestamp 当前的消息时间戳
 * @param count 数量
 * @param isForward 是否向前获取
 */
export declare function getHistoryMessages(conversationType: ConversationType, targetId: string, objectNames: ObjectName[], timestamp: number, count: number, isForward: boolean): Promise<Message[]>;
/**
 * 获取历史消息
 *
 * 此方法会获取该会话中，baseMessageId 之前或之后的、指定数量、消息类型和查询方向的最新消息实体，返回的消息实体按照时间从新到旧排列。
 * 返回的消息中不包含 baseMessageId 对应的那条消息，如果会话中的消息数量小于参数 count 的值，会将该会话中的所有消息返回。
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param objectName 消息对象名称，可以用 MessageObjectNames 获取消息类型对应的对象名称
 * @param baseMessageId 最近一条消息的 ID
 * @param count 数量
 * @param isForward 是否向前获取
 */
export declare function getHistoryMessages(conversationType: ConversationType, targetId: string, objectName: string, baseMessageId: number, count: number, isForward: boolean): Promise<Message[]>;
/**
 * 向本地会话插入一条发送消息
 *
 * @param conversationType
 * @param targetId
 * @param sentStatus
 * @param messageContent
 * @param sentTime
 */
export declare function insertOutgoingMessage(conversationType: ConversationType, targetId: string, sentStatus: SentStatus, messageContent: MessageContent, sentTime?: number): Promise<Message>;
/**
 * 向本地会话插入一条接收消息
 *
 * @param conversationType
 * @param targetId
 * @param senderUserId
 * @param receivedStatus
 * @param messageContent
 * @param sentTime
 */
export declare function insertIncomingMessage(conversationType: ConversationType, targetId: string, senderUserId: string, receivedStatus: number, messageContent: MessageContent, sentTime?: number): Promise<Message>;
/**
 * 清空某一会话的所有消息
 *
 * @param conversationType
 * @param targetId
 */
export declare function clearMessages(conversationType: ConversationType, targetId: string): Promise<boolean>;
/**
 * 删除某一会话的所有消息，同时清理数据库空间
 *
 * @param conversationType
 * @param targetId
 */
export declare function deleteMessages(conversationType: ConversationType, targetId: string): Promise<boolean>;
/**
 * 根据消息 ID 删除消息
 *
 * @param ids 消息 ID 列表
 */
export declare function deleteMessages(ids: number[]): Promise<boolean>;
/**
 * 根据关键字搜索会话
 *
 * @param keyword 关键字
 * @param conversationTypes 会话类型数组
 * @param objectNames 对象名称数组
 */
export declare function searchConversations(keyword: string, conversationTypes: ConversationType[], objectNames: ObjectName[]): Promise<SearchConversationResult[]>;
/**
 * 搜索消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param keyword 关键字
 * @param count 获取数量
 * @param startTime 开始时间
 */
export declare function searchMessages(conversationType: ConversationType, targetId: string, keyword: string, count: number, startTime?: number): Promise<Message[]>;
/**
 * 获取消息
 *
 * @param messageId 消息 ID
 */
export declare function getMessage(messageId: number): Promise<Message>;
/**
 * 根据消息 UID 获取消息
 *
 * @param messageUId 消息 UID
 */
export declare function getMessageByUId(messageUId: string): Promise<Message>;
/**
 * 设置消息的附加信息
 *
 * @param messageId 消息 ID
 * @param extra 附加信息
 */
export declare function setMessageExtra(messageId: number, extra: string): Promise<void>;
/**
 * 获取消息发送时间
 *
 * @param messageId 消息 ID
 */
export declare function getMessageSendTime(messageId: number): Promise<number>;
/**
 * 获取会话中的消息数量
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getMessageCount(conversationType: ConversationType, targetId: string): Promise<number>;
/**
 * 获取会话里第一条未读消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getFirstUnreadMessage(conversationType: ConversationType, targetId: string): Promise<Message>;
/**
 * 获取会话中 @ 提醒自己的消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getUnreadMentionedMessages(conversationType: ConversationType, targetId: string): Promise<Message[]>;
/**
 * 获取服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param sentTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 * @param count 删除数量
 */
export declare function getRemoteHistoryMessages(conversationType: ConversationType, targetId: string, sentTime: number, count: number): Promise<Message[]>;
/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param recordTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 */
export declare function cleanRemoteHistoryMessages(conversationType: ConversationType, targetId: string, recordTime: number): Promise<boolean>;
/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param recordTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 * @param clearRemote 是否同时删除服务端消息
 */
export declare function cleanHistoryMessages(conversationType: ConversationType, targetId: string, recordTime: number, clearRemote: boolean): Promise<boolean>;
/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param messages 要删除的消息数组，数组大小不能超过 100 条
 */
export declare function deleteRemoteMessages(conversationType: ConversationType, targetId: string, messages: Message[]): Promise<boolean>;
/**
 * 获取会话
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getConversation(conversationType: ConversationType, targetId: string): Promise<Conversation>;
/**
 * 获取会话列表
 *
 * @param conversationTypes 会话类型列表
 * @param count 获取的数量
 * @param timestamp 会话的时间戳（获取这个时间戳之前的会话列表，0
 *     表示从最新开始获取）
 */
export declare function getConversationList(conversationTypes?: ConversationType[], count?: number, timestamp?: number): Promise<Conversation[]>;
/**
 * 从会话列表中移除某一会话，但是不删除会话内的消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function removeConversation(conversationType: ConversationType, targetId: string): Promise<Conversation>;
/**
 * 设置会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param isBlock 是否屏蔽
 */
export declare function setConversationNotificationStatus(conversationType: ConversationType, targetId: string, isBlock: boolean): Promise<Conversation>;
/**
 * 获取会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getConversationNotificationStatus(conversationType: ConversationType, targetId: string): Promise<boolean>;
/**
 * 设置是否置顶会话
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param isTop 是否置顶
 */
export declare function setConversationToTop(conversationType: ConversationType, targetId: string, isTop: boolean): any;
/**
 * 获取置顶会话列表
 *
 * @param conversationTypes 会话类型列表
 */
export declare function getTopConversationList(conversationTypes?: ConversationType[]): Promise<Conversation[]>;
/**
 * 保存某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param content 草稿内容
 */
export declare function saveTextMessageDraft(conversationType: ConversationType, targetId: string, content: string): Promise<boolean>;
/**
 * 获取某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getTextMessageDraft(conversationType: ConversationType, targetId: string): Promise<string>;
/**
 * 清除某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function clearTextMessageDraft(conversationType: ConversationType, targetId: string): Promise<string>;
/**
 * 获取所有未读消息数
 */
export declare function getTotalUnreadCount(): Promise<number>;
/**
 * 获取指定会话的未读消息数
 *
 * @param conversationTypes 会话类型列表
 */
export declare function getUnreadCount(conversationTypes: ConversationType[]): Promise<number>;
/**
 * 获取指定会话的未读消息数
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getUnreadCount(conversationType: ConversationType, targetId: string): Promise<number>;
/**
 * 清除某个会话中的未读消息数
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param time 该会话已阅读的最后一条消息的发送时间戳
 */
export declare function clearMessagesUnreadStatus(conversationType: ConversationType, targetId: string, time?: number): Promise<boolean>;
/**
 * 把用户加入黑名单
 *
 * @param userId 用户 ID
 */
export declare function addToBlacklist(userId: string): Promise<void>;
/**
 * 把用户从黑名单种移除
 *
 * @param userId 用户 ID
 */
export declare function removeFromBlacklist(userId: string): Promise<void>;
/**
 * 获取某用户是否在黑名单中
 *
 * @param userId 用户 ID
 * @return 是否在黑名单中
 */
export declare function getBlacklistStatus(userId: string): Promise<boolean>;
/**
 * 获取黑名单列表
 *
 * @return 黑名单列表
 */
export declare function getBlacklist(): Promise<string[]>;
/**
 * 加入聊天室，如果已存在，直接加入，否则创建并加入
 *
 * @param targetId 聊天室 ID
 * @param messageCount 默认获取的消息数量，最多 50
 */
export declare function joinChatRoom(targetId: string, messageCount?: number): Promise<void>;
/**
 * 加入已存在的聊天室，如果不存在则加入失败
 *
 * @param targetId 聊天室 ID
 * @param messageCount 默认获取的消息数量，最多 50
 */
export declare function joinExistChatRoom(targetId: string, messageCount?: number): Promise<void>;
/**
 * 退出聊天室
 *
 * @param targetId 聊天室 ID
 */
export declare function quitChatRoom(targetId: string): Promise<void>;
/**
 * 从服务器端获取聊天室的历史消息
 *
 * @param targetId 目标 ID
 * @param recordTime 起始的消息发送时间戳，单位毫秒
 * @param count 要获取的消息数量
 * @param order 拉取顺序
 */
export declare function getRemoteChatRoomHistoryMessages(targetId: string, recordTime: number, count: number, order: TimestampOrder): Promise<{
    messages: Message[];
    syncTime: number;
}>;
/**
 * 获取聊天室信息
 *
 * @param targetId 聊天室 ID
 * @param memberCount 聊天室成员数量，最多获取 20 个
 * @param order 返回的聊天室成员排序方式
 */
export declare function getChatRoomInfo(targetId: string, memberCount?: number, order?: ChatRoomMemberOrder): Promise<ChatRoomInfo>;
/**
 * 创建讨论组
 *
 * @param name 讨论组名称
 * @param userList 用户 ID 列表
 */
export declare function createDiscussion(name: string, userList: string[]): Promise<string>;
/**
 * 获取讨论组信息
 *
 * @param targetId 讨论组 ID
 */
export declare function getDiscussion(targetId: string): Promise<Discussion>;
/**
 * 退出讨论组
 *
 * @param targetId 讨论组 ID
 */
export declare function quitDiscussion(targetId: string): Promise<void>;
/**
 * 把用户加入讨论组
 *
 * @param targetId 讨论组 ID
 * @param userList 用户 ID 列表
 */
export declare function addMemberToDiscussion(targetId: string, userList: string[]): Promise<void>;
/**
 * 把用户从讨论组移出
 *
 * @param targetId 讨论组 ID
 * @param user 用户 ID
 */
export declare function removeMemberFromDiscussion(targetId: string, user: string): Promise<void>;
/**
 * 设置讨论组名称
 *
 * @param targetId 讨论组 ID
 * @param name 讨论组名称
 */
export declare function setDiscussionName(targetId: string, name: string): Promise<void>;
/**
 * 设置讨论组拉人权限
 *
 * @param targetId 讨论组 ID
 * @param isOpen 是否开放拉人权限
 */
export declare function setDiscussionInviteStatus(targetId: string, isOpen: boolean): Promise<void>;
/**
 * 搜索公众服务
 *
 * @param keyword 关键字
 * @param searchType 搜索类型
 * @param publicServiceType 公众服务类型
 */
export declare function searchPublicService(keyword: string, searchType?: SearchType, publicServiceType?: PublicServiceType): Promise<PublicServiceProfile[]>;
/**
 * 订阅公共服务
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
export declare function subscribePublicService(publicServiceType: PublicServiceType, publicServiceId: string): Promise<void>;
/**
 * 取消关注公共服务
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
export declare function unsubscribePublicService(publicServiceType: PublicServiceType, publicServiceId: string): Promise<void>;
/**
 * 获取已订阅的公众服务列表
 */
export declare function getPublicServiceList(): Promise<PublicServiceProfile[]>;
/**
 * 获取单个公众服务信息
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
export declare function getPublicServiceProfile(publicServiceType: PublicServiceType, publicServiceId: string): Promise<PublicServiceProfile>;
/**
 * 发起实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function startRealTimeLocation(conversationType: ConversationType, targetId: string): any;
/**
 * 加入实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function joinRealTimeLocation(conversationType: ConversationType, targetId: string): any;
/**
 * 退出实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function quitRealTimeLocation(conversationType: ConversationType, targetId: string): any;
/**
 * 获取实时位置共享状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getRealTimeLocationStatus(conversationType: ConversationType, targetId: string): Promise<RealTimeLocationStatus>;
/**
 * 获取参与实时位置共享的所有成员
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export declare function getRealTimeLocationParticipants(conversationType: ConversationType, targetId: string): Promise<string[]>;
/**
 * 全局屏蔽某个时间段的消息提醒
 *
 * @param startTime 开始屏蔽消息提醒的时间，格式为HH:MM:SS
 * @param spanMinutes 需要屏蔽消息提醒的分钟数，0 < spanMinutes < 1440
 */
export declare function setNotificationQuietHours(startTime: string, spanMinutes: number): Promise<void>;
/**
 * 查询已设置的全局时间段消息提醒屏蔽
 */
export declare function getNotificationQuietHours(): Promise<{
    startTime: string;
    spanMinutes: number;
}>;
/**
 * 删除已设置的全局时间段消息提醒屏蔽
 */
export declare function removeNotificationQuietHours(): Promise<void>;
/**
 * 获取离线消息在服务端的存储时间（以天为单位）
 */
export declare function getOfflineMessageDuration(): Promise<number>;
/**
 * 设置离线消息在服务端的存储时间（以天为单位）
 */
export declare function setOfflineMessageDuration(duration: number): Promise<number>;
/**
 * 发起客服聊天回调
 */
export interface CSCallback {
    success?: (config: CSConfig) => void;
    error?: (code: number, message: string) => void;
    modeChanged?: (mode: CSMode) => void;
    pullEvaluation?: (dialogId: string) => void;
    quit?: (message: string) => void;
    selectGroup?: (groups: CSGroupItem[]) => void;
}
/**
 * 发起客服聊天
 *
 * @param kefuId 客服 ID
 * @param csInfo 客服信息
 * @param callback 回调
 */
export declare function startCustomerService(kefuId: string, csInfo: CSInfo, callback?: CSCallback): void;
/**
 * 切换至人工客服
 *
 * @param kefuId 客服 ID
 */
export declare function switchToHumanMode(kefuId: string): void;
/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param groupId 分组 ID
 */
export declare function selectCustomerServiceGroup(kefuId: string, groupId: string): void;
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
export declare function evaluateCustomerService(kefuId: string, dialogId: string, value: string, suggest: string, resolveStatus: CSResolveStatus, tagText?: any, extra?: any): void;
/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param message 客服留言信息
 */
export declare function leaveMessageCustomerService(kefuId: string, message: CSLeaveMessageItem): Promise<void>;
/**
 * 结束客服聊天
 *
 * @param kefuId 客服 ID
 */
export declare function stopCustomerService(kefuId: string): void;
/**
 * 获取当前用户 ID
 */
export declare function getCurrentUserId(): Promise<string>;
/**
 * 设置推送语言
 *
 * @param language 推送语言
 */
export declare function setPushLanguage(language: PushLanguage): Promise<void>;
/**
 * 设置是否显示内容详情
 *
 * @param isShowPushContent 是否显示内容详情
 */
export declare function setPushContentShowStatus(isShowPushContent: boolean): Promise<void>;
/**
 * 查询是否显示内容详情
 */
export declare function getPushContentShowStatus(): Promise<boolean>;
/**
 * 添加推送消息到达监听函数
 *
 * @param listener
 */
export declare function addPushArrivedListener(listener: (message: PushNotificationMessage) => void): any;
