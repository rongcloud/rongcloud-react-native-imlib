import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

import {
  ConnectionStatus,
  ConversationType,
  ErrorCode,
  Message,
  ObjectName,
  PublicServiceType,
  RecallNotificationMessage,
  ReceiptRequest,
  ReceiveMessage,
  SentMessage,
  TypingStatus,
  ConnectErrorCode,
  Conversation,
  MessageContent,
  PublicServiceProfile,
  ReceiptResponse,
  SearchType,
  SentStatus,
  SearchConversationResult,
  TimestampOrder,
  ChatRoomMemberOrder,
  ChatRoomInfo,
  Discussion,
  RealTimeLocationStatus,
  CSConfig,
  CSMode,
  CSGroupItem,
  CSInfo,
  CSResolveStatus,
  CSLeaveMessageItem,
  PushLanguage,
  PushNotificationMessage,
  MessageObjectNames
} from "./types";

export * from "./types";

const LINKING_ERROR =
  `The package '@rongcloud/react-native-imlib' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';


const RCIMClient = NativeModules.RCIMClient
  ? NativeModules.RCIMClient
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );
const eventEmitter = new NativeEventEmitter(RCIMClient);

/**
 * 初始化 SDK，只需要调用一次
 *
 * @param appKey 从融云开发者平台创建应用后获取到的 App Key
 */
export function init(appKey: string) {
  RCIMClient.init(appKey);
}

/**
 * 添加日志信息监听函数
 *
 * @param listener
 */
export function addLogInfoListener(listener: (logInfo: string) => void) {
  return eventEmitter.addListener("rcimlib-log", listener);
}

/**
 * 添加消息撤回监听函数
 *
 * @param listener
 */
export function addRecallMessageListener(listener: (messageId: string) => void) {
  return eventEmitter.addListener("rcimlib-recall", listener);
}

/**
 * 同步会话阅读状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param timestamp 该会话中已读的最后一条消息的发送时间戳
 */
export function syncConversationReadStatus(
  conversationType: ConversationType,
  targetId: string,
  timestamp: number
): Promise<void> {
  return RCIMClient.syncConversationReadStatus(conversationType, targetId, timestamp);
}

/**
 * 设置 deviceToken，用于远程推送
 *
 * @param deviceToken 从系统获取到的设备号 deviceToken（需要去掉空格和尖括号）
 *
 *   deviceToken是系统提供的，从苹果服务器获取的，用于APNs远程推送必须使用的设备唯一值。
 *   您需要将 `-application:didRegisterForRemoteNotificationsWithDeviceToken:`
 *   获取到的deviceToken，转为NSString类型，并去掉其中的空格和尖括号，作为参数传入此方法。
 */
export function setDeviceToken(deviceToken: string) {
  RCIMClient.setDeviceToken(deviceToken);
}

/**
 * 设置导航服务器和上传文件服务器信息，要在 [[init]] 前使用
 *
 * @param naviServer 导航服务器地址
 * @param fileServer 文件服务器地址
 */
export function setServerInfo(naviServer: string, fileServer: string) {
  RCIMClient.setServerInfo(naviServer, fileServer);
}

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
export function setStatisticServer(server: string) {
  RCIMClient.setStatisticServer(server);
}

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
export function connect(
  token: string,
  success: (userId: string) => void,
  error: (errorCode: ConnectErrorCode) => void,
  tokenIncorrect: () => void
) {
  const eventId = Math.random().toString();
  const listener = eventEmitter.addListener("rcimlib-connect", data => {
    if (data.eventId === eventId) {
      if (data.type === "success") {
        success && success(data.userId);
      } else if (data.type === "error") {
        error && error(data.errorCode);
      } else if (data.type === "tokenIncorrect") {
        tokenIncorrect && tokenIncorrect();
      }
      listener.remove();
    }
  });
  RCIMClient.connect(token, eventId);
}

/**
 * 断开与融云服务器的连接
 *
 * @param isReceivePush 是否还接收推送
 */
export function disconnect(isReceivePush = true) {
  RCIMClient.disconnect(isReceivePush);
}

/**
 * 获取当前连接状态
 */
export function getConnectionStatus(): Promise<ConnectionStatus> {
  return RCIMClient.getConnectionStatus();
}

/**
 * 添加消息监听函数
 */
export function addReceiveMessageListener(listener: (message: ReceiveMessage) => void) {
  return eventEmitter.addListener("rcimlib-receive-message", listener);
}

/**
 * 发送消息回调
 */
export interface SentMessageCallback {
  attached?:(message: Message) => void;
  success?: (messageId: number) => void;
  progress?: (progress: number, messageId: number) => void;
  cancel?: () => void;
  error?: (errorCode: ErrorCode, messageId: number, errorMessage?: string) => void;
}

function handleSendMessageCallback(callback: SentMessageCallback): string {
  const eventId = Math.random().toString();
  if (callback) {
    const listener = eventEmitter.addListener("rcimlib-send-message", data => {
      if (data.eventId === eventId) {
        const { attached, success, error, cancel, progress } = callback;
        if (data.type === "success") {
          success && success(data.messageId);
          listener.remove();
        } else if (data.type === "error") {
          error && error(data.errorCode, data.messageId, data.errorMessage);
          listener.remove();
        } else if (data.type === "cancel") {
          cancel && cancel();
          listener.remove();
        } else if (data.type === "progress") {
          progress && progress(data.progress, data.messageId);
        } else if (data.type === "attached") {
          attached && attached(data.message);
        }
      }
    });
  }
  return eventId;
}

/**
 * 发送消息
 *
 * @param message 消息
 * @param callback 回调
 */
export function sendMessage(message: SentMessage, callback: SentMessageCallback = {}) {
  message.content = handleMessageContent(message.content);
  RCIMClient.sendMessage(message, handleSendMessageCallback(callback));
}

/**
 * 重发某条发送状态为失败的消息，此接口会将原本发送失败的消息替换为新消息，消息 id 不变
 * @param messageId 消息 ID
 * @param pushContent 推送内容
 * @param pushData 推送数据
 * @param callback 回调
 */
export function resendMessageById(messageId:number,pushContent:string,pushData:string,callback:SentMessageCallback={}) {
  RCIMClient.resendMessageById(messageId,pushContent,pushData,handleSendMessageCallback(callback));
}

/**
 * 发送媒体消息
 *
 * @param message 消息
 * @param callback 回调
 */
export function sendMediaMessage(message: SentMessage, callback: SentMessageCallback = {}) {
  message.content = handleMessageContent(message.content);
  RCIMClient.sendMediaMessage(message, handleSendMessageCallback(callback));
}

/**
 * 发送定向消息
 *
 * @param message 消息
 * @param userIdList 用户 ID 列表
 * @param callback 回调
 */
export function sendDirectionalMessage(
  message: SentMessage,
  userIdList: string[],
  callback: SentMessageCallback
) {
  message.content = handleMessageContent(message.content);
  RCIMClient.sendDirectionalMessage(message, userIdList, handleSendMessageCallback(callback));
}

/**
 * 消息撤回
 *
 * @param messageId 消息 ID
 * @param pushContent 推送内容
 */
export function recallMessage(
  messageId: number,
  pushContent = ""
): Promise<RecallNotificationMessage> {
  return RCIMClient.recallMessage(messageId, pushContent);
}

/**
 * 发送输入状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param typingContentType 输入内容类型
 */
export function sendTypingStatus(
  conversationType: ConversationType,
  targetId: string,
  typingContentType: string
) {
  RCIMClient.sendTypingStatus(conversationType, targetId, typingContentType);
}

/**
 * 添加输入状态监听函数
 */
export function addTypingStatusListener(listener: (status: TypingStatus) => void) {
  return eventEmitter.addListener("rcimlib-typing-status", listener);
}

/**
 * 设置消息发送状态
 *
 * @param messageId 消息 ID
 * @param status 状态
 */
export function setMessageSentStatus(messageId: number, status: SentStatus): Promise<void> {
  return RCIMClient.setMessageSentStatus(messageId, status);
}

/**
 * 设置消息接收状态
 *
 * @param messageId 消息 ID
 * @param status 状态
 */
export function setMessageReceivedStatus(messageId: number, status: number): Promise<void> {
  return RCIMClient.setMessageReceivedStatus(messageId, status);
}

/**
 * 获取屏蔽消息提醒的会话列表
 *
 * @param conversationTypeList 消息类型列表
 */
export function getBlockedConversationList(
  conversationTypeList: ConversationType[]
): Promise<Conversation[]> {
  return RCIMClient.getBlockedConversationList(conversationTypeList);
}

/**
 * 发送阅读回执
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param timestamp 该会话中已阅读点最后一条消息的发送时间戳
 */
export function sendReadReceiptMessage(
  conversationType: ConversationType,
  targetId: string,
  timestamp: number
) {
  RCIMClient.sendReadReceiptMessage(conversationType, targetId, timestamp);
}

/**
 * 发起群组消息回执请求
 *
 * @param messageId 消息 ID
 */
export function sendReadReceiptRequest(messageId: number): Promise<void> {
  return RCIMClient.sendReadReceiptRequest(messageId);
}

/**
 * 发起群组消息回执响应
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param messages 回执的消息列表
 */
export function sendReadReceiptResponse(
  conversationType: ConversationType,
  targetId: string,
  messages: Message[]
): Promise<void> {
  return RCIMClient.sendReadReceiptResponse(conversationType, targetId, messages);
}

/**
 * 添加私聊阅读回执监听函数
 */
export function addReadReceiptReceivedListener(listener: (message: Message) => void) {
  return eventEmitter.addListener("rcimlib-read-receipt-received", listener);
}

/**
 * 添加收到消息已读回执请求监听函数
 *
 * 收到此请求后，如果用户阅读了对应的消息，需要调用
 * sendMessageReadReceiptResponse 接口发送已读响应
 */
export function addReceiptRequestListener(listener: (data: ReceiptRequest) => void) {
  return eventEmitter.addListener("rcimlib-receipt-request", listener);
}

/**
 * 添加消息回执响应监听函数
 *
 * @param listener
 */
export function addReceiptResponseListener(listener: (data: ReceiptResponse) => void) {
  return eventEmitter.addListener("rcimlib-receipt-response", listener);
}

/**
 * 取消发送中的媒体消息
 *
 * @param messageId 消息 ID
 */
export function cancelSendMediaMessage(messageId: number): Promise<void> {
  return RCIMClient.cancelSendMediaMessage(messageId);
}

/**
 * 取消下载中的媒体消息
 *
 * @param messageId 消息 ID
 */
export function cancelDownloadMediaMessage(messageId: number): Promise<void> {
  return RCIMClient.cancelDownloadMediaMessage(messageId);
}

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
export function downloadMediaMessage(messageId: number, callback: MediaMessageCallback = {}) {
  const eventId = Math.random().toString();
  const listener = eventEmitter.addListener("rcimlib-download-media-message", data => {
    if (callback) {
      if (data.eventId === eventId) {
        const { success, error, progress, cancel } = callback;
        if (data.type === "success") {
          success && success(data.path);
          listener.remove();
        } else if (data.type === "error") {
          error && error(data.errorCode);
          listener.remove();
        } else if (data.type === "progress") {
          progress && progress(data.progress);
        } else if (data.type === "cancel") {
          cancel && cancel();
        }
      }
    }
  });
  RCIMClient.downloadMediaMessage(messageId, eventId);
}

/**
 * 添加连接状态监听函数
 */
export function addConnectionStatusListener(listener: (status: ConnectionStatus) => void) {
  return eventEmitter.addListener("rcimlib-connection-status", listener);
}

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
export function setReconnectKickEnable(enabled: boolean) {
  RCIMClient.setReconnectKickEnable(enabled);
}

/**
 * 获取历史消息
 *
 * 此方法会获取该会话中，timestamp 之前或之后的、指定数量、指定消息类型（多个）的消息实体列表，返回的消息实体按照时间从新到旧排列。
 * 
 * objectNames 如果为空数组，获取该会话的这条消息及这条消息前 count 条消息
 * objectNames 如果不为空数组，返回的消息中不包含 sentTime 对应的那条消息
 * 如果会话中的消息数量小于参数 count 的值，会将该会话中的所有消息返回。
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param objectNames 对象名称数组，仅当该参数为数组时调用该方法
 * @param timestamp 当前的消息时间戳
 * @param count 数量
 * @param isForward 是否向前获取
 */
export function getHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  objectNames: ObjectName[],
  timestamp: number,
  count: number,
  isForward: boolean
): Promise<Message[]>;

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
export function getHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  objectName: string,
  baseMessageId: number,
  count: number,
  isForward: boolean
): Promise<Message[]>;

export function getHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  objectName: string | ObjectName[],
  baseMessageId = -1,
  count = 10,
  isForward = true
): Promise<Message[]> {
  if (Array.isArray(objectName)) {
    return RCIMClient.getHistoryMessagesByTimestamp(
      conversationType,
      targetId,
      objectName,
      baseMessageId,
      count,
      isForward
    );
  } else {
    return RCIMClient.getHistoryMessages(
      conversationType,
      targetId,
      objectName,
      baseMessageId,
      count,
      isForward
    );
  }
}

/**
 * 消息内容兼容性处理
 */
function handleMessageContent(content: MessageContent) {
  if (!content.objectName) {
    // @ts-ignore
    content.objectName = MessageObjectNames[content.type];
  }
  return content;
}

/**
 * 向本地会话插入一条发送消息
 *
 * @param conversationType
 * @param targetId
 * @param sentStatus
 * @param messageContent
 * @param sentTime
 */
export function insertOutgoingMessage(
  conversationType: ConversationType,
  targetId: string,
  sentStatus: SentStatus,
  messageContent: MessageContent,
  sentTime = 0
): Promise<Message> {
  return RCIMClient.insertOutgoingMessage(
    conversationType,
    targetId,
    sentStatus,
    handleMessageContent(messageContent),
    sentTime
  );
}

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
export function insertIncomingMessage(
  conversationType: ConversationType,
  targetId: string,
  senderUserId: string,
  receivedStatus: number,
  messageContent: MessageContent,
  sentTime = 0
): Promise<Message> {
  return RCIMClient.insertIncomingMessage(
    conversationType,
    targetId,
    senderUserId,
    receivedStatus,
    handleMessageContent(messageContent),
    sentTime
  );
}

/**
 * 清空某一会话的所有消息
 *
 * @param conversationType
 * @param targetId
 */
export function clearMessages(
  conversationType: ConversationType,
  targetId: string
): Promise<boolean> {
  return RCIMClient.clearMessages(conversationType, targetId);
}

/**
 * 删除某一会话的所有消息，同时清理数据库空间
 *
 * @param conversationType
 * @param targetId
 */
export function deleteMessages(
  conversationType: ConversationType,
  targetId: string
): Promise<boolean>;

/**
 * 根据消息 ID 删除消息
 *
 * @param ids 消息 ID 列表
 */
export function deleteMessages(ids: number[]): Promise<boolean>;

export function deleteMessages(
  typeOrIds: ConversationType | number[],
  targetId = ""
): Promise<boolean> {
  if (Array.isArray(typeOrIds)) {
    return RCIMClient.deleteMessagesByIds(typeOrIds);
  }
  return RCIMClient.deleteMessages(typeOrIds, targetId);
}

/**
 * 根据关键字搜索会话
 *
 * @param keyword 关键字
 * @param conversationTypes 会话类型数组
 * @param objectNames 对象名称数组
 */
export function searchConversations(
  keyword: string,
  conversationTypes: ConversationType[],
  objectNames: ObjectName[]
): Promise<SearchConversationResult[]> {
  return RCIMClient.searchConversations(keyword, conversationTypes, objectNames);
}

/**
 * 搜索消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param keyword 关键字
 * @param count 获取数量
 * @param startTime 开始时间
 */
export function searchMessages(
  conversationType: ConversationType,
  targetId: string,
  keyword: string,
  count: number,
  startTime = 0
): Promise<Message[]> {
  return RCIMClient.searchMessages(conversationType, targetId, keyword, count, startTime);
}

/**
 * 获取消息
 *
 * @param messageId 消息 ID
 */
export function getMessage(messageId: number): Promise<Message> {
  return RCIMClient.getMessage(messageId);
}

/**
 * 根据消息 UID 获取消息
 *
 * @param messageUId 消息 UID
 */
export function getMessageByUId(messageUId: string): Promise<Message> {
  return RCIMClient.getMessageByUId(messageUId);
}

/**
 * 设置消息的附加信息
 *
 * @param messageId 消息 ID
 * @param extra 附加信息
 */
export function setMessageExtra(messageId: number, extra: string): Promise<void> {
  return RCIMClient.setMessageExtra(messageId, extra);
}

/**
 * 获取消息发送时间
 *
 * @param messageId 消息 ID
 */
export function getMessageSendTime(messageId: number): Promise<number> {
  return RCIMClient.getMessageSendTime(messageId);
}

/**
 * 获取会话中的消息数量
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getMessageCount(
  conversationType: ConversationType,
  targetId: string
): Promise<number> {
  return RCIMClient.getMessageCount(conversationType, targetId);
}

/**
 * 获取会话里第一条未读消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getFirstUnreadMessage(
  conversationType: ConversationType,
  targetId: string
): Promise<Message> {
  return RCIMClient.getFirstUnreadMessage(conversationType, targetId);
}

/**
 * 获取会话中 @ 提醒自己的消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getUnreadMentionedMessages(
  conversationType: ConversationType,
  targetId: string
): Promise<Message[]> {
  return RCIMClient.getUnreadMentionedMessages(conversationType, targetId);
}

/**
 * 获取服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param sentTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 * @param count 删除数量
 */
export function getRemoteHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  sentTime: number,
  count: number
): Promise<Message[]> {
  return RCIMClient.getRemoteHistoryMessages(conversationType, targetId, sentTime, count);
}

/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param recordTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 */
export function cleanRemoteHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  recordTime: number
): Promise<boolean> {
  return RCIMClient.cleanRemoteHistoryMessages(conversationType, targetId, recordTime);
}

/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param recordTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 * @param clearRemote 是否同时删除服务端消息
 */
export function cleanHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  recordTime: number,
  clearRemote: boolean
): Promise<boolean> {
  return RCIMClient.cleanHistoryMessages(conversationType, targetId, recordTime, clearRemote);
}

/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param messages 要删除的消息数组，数组大小不能超过 100 条
 */
export function deleteRemoteMessages(
  conversationType: ConversationType,
  targetId: string,
  messages: Message[]
): Promise<boolean> {
  return RCIMClient.deleteRemoteMessages(conversationType, targetId, messages);
}

/**
 * 获取会话
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getConversation(
  conversationType: ConversationType,
  targetId: string
): Promise<Conversation> {
  return RCIMClient.getConversation(conversationType, targetId);
}

/**
 * 获取会话列表
 *
 * @param conversationTypes 会话类型列表
 * @param count 获取的数量
 * @param timestamp 会话的时间戳（获取这个时间戳之前的会话列表，0
 *     表示从最新开始获取）
 */
export function getConversationList(
  conversationTypes: ConversationType[] = [],
  count = 0,
  timestamp = 0
): Promise<Conversation[]> {
  return RCIMClient.getConversationList(conversationTypes, count, timestamp);
}

/**
 * 从会话列表中移除某一会话，但是不删除会话内的消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function removeConversation(
  conversationType: ConversationType,
  targetId: string
): Promise<Conversation> {
  return RCIMClient.removeConversation(conversationType, targetId);
}

/**
 * 设置会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param isBlock 是否屏蔽
 */
export function setConversationNotificationStatus(
  conversationType: ConversationType,
  targetId: string,
  isBlock: boolean
): Promise<Conversation> {
  return RCIMClient.setConversationNotificationStatus(conversationType, targetId, isBlock);
}

/**
 * 获取会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getConversationNotificationStatus(
  conversationType: ConversationType,
  targetId: string
): Promise<boolean> {
  return RCIMClient.getConversationNotificationStatus(conversationType, targetId);
}

/**
 * 设置是否置顶会话
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param isTop 是否置顶
 */
export function setConversationToTop(
  conversationType: ConversationType,
  targetId: string,
  isTop: boolean
) {
  return RCIMClient.setConversationToTop(conversationType, targetId, isTop);
}

/**
 * 获取置顶会话列表
 *
 * @param conversationTypes 会话类型列表
 */
export function getTopConversationList(
  conversationTypes: ConversationType[] = []
): Promise<Conversation[]> {
  return RCIMClient.getTopConversationList(conversationTypes);
}

/**
 * 保存某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param content 草稿内容
 */
export function saveTextMessageDraft(
  conversationType: ConversationType,
  targetId: string,
  content: string
): Promise<boolean> {
  return RCIMClient.saveTextMessageDraft(conversationType, targetId, content);
}

/**
 * 获取某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getTextMessageDraft(
  conversationType: ConversationType,
  targetId: string
): Promise<string> {
  return RCIMClient.getTextMessageDraft(conversationType, targetId);
}

/**
 * 清除某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function clearTextMessageDraft(
  conversationType: ConversationType,
  targetId: string
): Promise<string> {
  return RCIMClient.clearTextMessageDraft(conversationType, targetId);
}

/**
 * 获取所有未读消息数
 */
export function getTotalUnreadCount(): Promise<number> {
  return RCIMClient.getTotalUnreadCount();
}

/**
 * 获取指定会话的未读消息数
 *
 * @param conversationTypes 会话类型列表
 */
export function getUnreadCount(conversationTypes: ConversationType[]): Promise<number>;

/**
 * 获取指定会话的未读消息数
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getUnreadCount(
  conversationType: ConversationType,
  targetId: string
): Promise<number>;

export function getUnreadCount(
  conversationType: ConversationType | ConversationType[],
  targetId = ""
): Promise<number> {
  if (Array.isArray(conversationType)) {
    return RCIMClient.getUnreadCount(0, "", conversationType);
  }
  return RCIMClient.getUnreadCount(conversationType, targetId, []);
}

/**
 * 清除某个会话中的未读消息数
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param time 该会话已阅读的最后一条消息的发送时间戳
 */
export function clearMessagesUnreadStatus(
  conversationType: ConversationType,
  targetId: string,
  time = 0
): Promise<boolean> {
  return RCIMClient.clearMessagesUnreadStatus(conversationType, targetId, time);
}

/**
 * 把用户加入黑名单
 *
 * @param userId 用户 ID
 */
export function addToBlacklist(userId: string): Promise<void> {
  return RCIMClient.addToBlacklist(userId);
}

/**
 * 把用户从黑名单种移除
 *
 * @param userId 用户 ID
 */
export function removeFromBlacklist(userId: string): Promise<void> {
  return RCIMClient.removeFromBlacklist(userId);
}

/**
 * 获取某用户是否在黑名单中
 *
 * @param userId 用户 ID
 * @return 是否在黑名单中
 */
export function getBlacklistStatus(userId: string): Promise<boolean> {
  return RCIMClient.getBlacklistStatus(userId);
}

/**
 * 获取黑名单列表
 *
 * @return 黑名单列表
 */
export function getBlacklist(): Promise<string[]> {
  return RCIMClient.getBlacklist();
}

/**
 * 加入聊天室，如果已存在，直接加入，否则创建并加入
 *
 * @param targetId 聊天室 ID
 * @param messageCount 默认获取的消息数量，最多 50
 */
export function joinChatRoom(targetId: string, messageCount = 10): Promise<void> {
  return RCIMClient.joinChatRoom(targetId, messageCount);
}

/**
 * 加入已存在的聊天室，如果不存在则加入失败
 *
 * @param targetId 聊天室 ID
 * @param messageCount 默认获取的消息数量，最多 50
 */
export function joinExistChatRoom(targetId: string, messageCount = 10): Promise<void> {
  return RCIMClient.joinExistChatRoom(targetId, messageCount);
}

/**
 * 退出聊天室
 *
 * @param targetId 聊天室 ID
 */
export function quitChatRoom(targetId: string): Promise<void> {
  return RCIMClient.quitChatRoom(targetId);
}

/**
 * 从服务器端获取聊天室的历史消息
 *
 * @param targetId 目标 ID
 * @param recordTime 起始的消息发送时间戳，单位毫秒
 * @param count 要获取的消息数量
 * @param order 拉取顺序
 */
export function getRemoteChatRoomHistoryMessages(
  targetId: string,
  recordTime: number,
  count: number,
  order: TimestampOrder
): Promise<{ messages: Message[]; syncTime: number }> {
  return RCIMClient.getRemoteChatRoomHistoryMessages(targetId, recordTime, count, order);
}

/**
 * 获取聊天室信息
 *
 * @param targetId 聊天室 ID
 * @param memberCount 聊天室成员数量，最多获取 20 个
 * @param order 返回的聊天室成员排序方式
 */
export function getChatRoomInfo(
  targetId: string,
  memberCount: number = 20,
  order: ChatRoomMemberOrder = ChatRoomMemberOrder.ASC
): Promise<ChatRoomInfo> {
  return RCIMClient.getChatRoomInfo(targetId, memberCount, order);
}

/**
 * 创建讨论组
 *
 * @param name 讨论组名称
 * @param userList 用户 ID 列表
 */
export function createDiscussion(name: string, userList: string[]): Promise<string> {
  return RCIMClient.createDiscussion(name, userList);
}

/**
 * 获取讨论组信息
 *
 * @param targetId 讨论组 ID
 */
export function getDiscussion(targetId: string): Promise<Discussion> {
  return RCIMClient.getDiscussion(targetId);
}

/**
 * 退出讨论组
 *
 * @param targetId 讨论组 ID
 */
export function quitDiscussion(targetId: string): Promise<void> {
  return RCIMClient.quitDiscussion(targetId);
}

/**
 * 把用户加入讨论组
 *
 * @param targetId 讨论组 ID
 * @param userList 用户 ID 列表
 */
export function addMemberToDiscussion(targetId: string, userList: string[]): Promise<void> {
  return RCIMClient.addMemberToDiscussion(targetId, userList);
}

/**
 * 把用户从讨论组移出
 *
 * @param targetId 讨论组 ID
 * @param user 用户 ID
 */
export function removeMemberFromDiscussion(targetId: string, user: string): Promise<void> {
  return RCIMClient.removeMemberFromDiscussion(targetId, user);
}

/**
 * 设置讨论组名称
 *
 * @param targetId 讨论组 ID
 * @param name 讨论组名称
 */
export function setDiscussionName(targetId: string, name: string): Promise<void> {
  return RCIMClient.setDiscussionName(targetId, name);
}

/**
 * 设置讨论组拉人权限
 *
 * @param targetId 讨论组 ID
 * @param isOpen 是否开放拉人权限
 */
export function setDiscussionInviteStatus(targetId: string, isOpen: boolean): Promise<void> {
  return RCIMClient.setDiscussionInviteStatus(targetId, isOpen);
}

/**
 * 搜索公众服务
 *
 * @param keyword 关键字
 * @param searchType 搜索类型
 * @param publicServiceType 公众服务类型
 */
export function searchPublicService(
  keyword: string,
  searchType: SearchType = SearchType.FUZZY,
  publicServiceType: PublicServiceType = 0
): Promise<PublicServiceProfile[]> {
  return RCIMClient.searchPublicService(keyword, searchType, publicServiceType);
}

/**
 * 订阅公共服务
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
export function subscribePublicService(
  publicServiceType: PublicServiceType,
  publicServiceId: string
): Promise<void> {
  return RCIMClient.subscribePublicService(publicServiceType, publicServiceId);
}

/**
 * 取消关注公共服务
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
export function unsubscribePublicService(
  publicServiceType: PublicServiceType,
  publicServiceId: string
): Promise<void> {
  return RCIMClient.unsubscribePublicService(publicServiceType, publicServiceId);
}

/**
 * 获取已订阅的公众服务列表
 */
export function getPublicServiceList(): Promise<PublicServiceProfile[]> {
  return RCIMClient.getPublicServiceList();
}

/**
 * 获取单个公众服务信息
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
export function getPublicServiceProfile(
  publicServiceType: PublicServiceType,
  publicServiceId: string
): Promise<PublicServiceProfile> {
  return RCIMClient.getPublicServiceProfile(publicServiceType, publicServiceId);
}

/**
 * 发起实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function startRealTimeLocation(conversationType: ConversationType, targetId: string) {
  return RCIMClient.startRealTimeLocation(conversationType, targetId);
}

/**
 * 加入实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function joinRealTimeLocation(conversationType: ConversationType, targetId: string) {
  return RCIMClient.joinRealTimeLocation(conversationType, targetId);
}

/**
 * 退出实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function quitRealTimeLocation(conversationType: ConversationType, targetId: string) {
  return RCIMClient.quitRealTimeLocation(conversationType, targetId);
}

/**
 * 获取实时位置共享状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getRealTimeLocationStatus(
  conversationType: ConversationType,
  targetId: string
): Promise<RealTimeLocationStatus> {
  return RCIMClient.getRealTimeLocationStatus(conversationType, targetId);
}

/**
 * 获取参与实时位置共享的所有成员
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
export function getRealTimeLocationParticipants(
  conversationType: ConversationType,
  targetId: string
): Promise<string[]> {
  return RCIMClient.getRealTimeLocationParticipants(conversationType, targetId);
}

/**
 * 全局屏蔽某个时间段的消息提醒
 *
 * @param startTime 开始屏蔽消息提醒的时间，格式为HH:MM:SS
 * @param spanMinutes 需要屏蔽消息提醒的分钟数，0 < spanMinutes < 1440
 */
export function setNotificationQuietHours(startTime: string, spanMinutes: number): Promise<void> {
  return RCIMClient.setNotificationQuietHours(startTime, spanMinutes);
}

/**
 * 查询已设置的全局时间段消息提醒屏蔽
 */
export function getNotificationQuietHours(): Promise<{ startTime: string; spanMinutes: number }> {
  return RCIMClient.getNotificationQuietHours();
}

/**
 * 删除已设置的全局时间段消息提醒屏蔽
 */
export function removeNotificationQuietHours(): Promise<void> {
  return RCIMClient.removeNotificationQuietHours();
}

/**
 * 获取离线消息在服务端的存储时间（以天为单位）
 */
export function getOfflineMessageDuration(): Promise<number> {
  return RCIMClient.getOfflineMessageDuration();
}

/**
 * 设置离线消息在服务端的存储时间（以天为单位）
 */
export async function setOfflineMessageDuration(duration: number): Promise<number> {
  return parseInt(await RCIMClient.setOfflineMessageDuration(duration));
}

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
export function startCustomerService(kefuId: string, csInfo: CSInfo, callback: CSCallback) {
  const eventId = Math.random().toString();
  if (callback) {
    const { success, error, modeChanged, selectGroup, pullEvaluation, quit } = callback;
    const listener = eventEmitter.addListener("rcimlib-customer-service", data => {
      if (data.eventId === eventId) {
        if (data.type === "success") {
          success && success(data.config);
        } else if (data.type === "error") {
          error && error(data.errorCode, data.errorMessage);
          listener.remove();
        } else if (data.type === "mode-changed") {
          modeChanged && modeChanged(data.mode);
        } else if (data.type === "pull-evaluation") {
          pullEvaluation && pullEvaluation(data.dialogId);
        } else if (data.type === "select-group") {
          selectGroup && selectGroup(data.groups);
        } else if (data.type === "quit") {
          quit && quit(data.message);
          listener.remove();
        }
      }
    });
  }
  RCIMClient.startCustomerService(kefuId, csInfo, eventId);
}

/**
 * 切换至人工客服
 *
 * @param kefuId 客服 ID
 */
export function switchToHumanMode(kefuId: string) {
  RCIMClient.switchToHumanMode(kefuId);
}

/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param groupId 分组 ID
 */
export function selectCustomerServiceGroup(kefuId: string, groupId: string) {
  RCIMClient.selectCustomServiceGroup(kefuId, groupId);
}

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
export function evaluateCustomerService(
  kefuId: string,
  dialogId: string,
  value: string,
  suggest: string,
  resolveStatus: CSResolveStatus,
  tagText = null,
  extra = null
) {
  RCIMClient.evaluateCustomerService(
    kefuId,
    dialogId,
    value,
    suggest,
    resolveStatus,
    tagText,
    extra
  );
}

/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param message 客服留言信息
 */
export function leaveMessageCustomerService(
  kefuId: string,
  message: CSLeaveMessageItem
): Promise<void> {
  return RCIMClient.leaveMessageCustomerService(kefuId, message);
}

/**
 * 结束客服聊天
 *
 * @param kefuId 客服 ID
 */
export function stopCustomerService(kefuId: string) {
  RCIMClient.stopCustomerService(kefuId);
}

/**
 * 获取当前用户 ID
 */
export function getCurrentUserId(): Promise<string> {
  return RCIMClient.getCurrentUserId();
}

/**
 * 设置推送语言
 *
 * @param language 推送语言
 */
export function setPushLanguage(language: PushLanguage): Promise<void> {
  return RCIMClient.setPushLanguage(language);
}

/**
 * 设置是否显示内容详情
 *
 * @param isShowPushContent 是否显示内容详情
 */
export function setPushContentShowStatus(isShowPushContent: boolean): Promise<void> {
  return RCIMClient.setPushContentShowStatus(isShowPushContent);
}

/**
 * 查询是否显示内容详情
 */
export function getPushContentShowStatus(): Promise<boolean> {
  return RCIMClient.getPushContentShowStatus();
}

/**
 * 添加推送消息到达监听函数
 *
 * @param listener
 */
export function addPushArrivedListener(listener: (message: PushNotificationMessage) => void) {
  return eventEmitter.addListener("rcimlib-push-arrived", listener);
}

