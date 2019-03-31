/**
 * @module RCIMClient
 */

import { NativeEventEmitter, NativeModules } from "react-native";

/**
 * @hidden
 */
const RCIMClient = NativeModules.RCIMClient;

/**
 * @hidden
 */
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
  success: (userId: string) => void = null,
  error: (errorCode: ConnectErrorCode) => void = null,
  tokenIncorrect: () => void = null
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
 * 消息方向
 */
export enum MessageDirection {
  SEND = 1,
  RECEIVE
}

/**
 * 会话类型
 */
export enum ConversationType {
  PRIVATE = 1,
  DISCUSSION,
  GROUP,
  CHATROOM,
  CUSTOMER_SERVICE,
  SYSTEM,
  APP_SERVICE,
  PUBLIC_SERVICE,
  PUSH_SERVICE
}

/**
 * 发送状态
 */
export enum SentStatus {
  SENDING = 10,
  FAILED = 20,
  SENT = 30,
  RECEIVED = 40,
  READ = 50,
  DESTROYED = 60,
  CANCELED = 70
}

export type TextMessage = {
  type: "text";
  content: string;
  extra?: string;
};

export type ImageMessage = {
  type: "image";
  local: string;
  remote?: string;
  thumbnail?: string;
  isFull?: string;
  extra?: string;
};

export type FileMessage = {
  type: "file";
  local: string;
  remote?: string;
  name?: string;
  size?: number;
  fileType?: string;
  extra?: string;
};

export type MessageContent = TextMessage | ImageMessage | FileMessage;

export type Message = {
  /**
   * 会话类型
   */
  conversationType: ConversationType;

  /**
   * 消息对象名称
   */
  objectName: string;

  /**
   * 消息 ID
   */
  messageId: number;

  /**
   * 消息 UID
   */
  messageUId: string;

  /**
   * 消息方向
   */
  messageDirection: MessageDirection;

  /**
   * 发送者 ID
   */
  senderUserId: string;

  /**
   * 发送时间
   */
  sentTime: number;

  /**
   * 目标 ID
   */
  targetId: string;

  /**
   * 消息接收时间
   */
  receivedTime: number;

  /**
   * 消息内容
   */
  content: MessageContent;

  /**
   * 附加信息
   */
  extra?: string;
};

/**
 * 添加消息监听函数
 */
export function addReceiveMessageListener(listener: (message: Message) => void) {
  return eventEmitter.addListener("rcimlib-receive-message", message => {
    listener(message);
  });
}

export type SentMessage = {
  conversationType: ConversationType;
  targetId: string;
  content: TextMessage;
  pushContent: string;
  pushData: string;
};

export type SentMessageCallback = {
  success?: (messageId: number) => void;
  error?: (errorCode: ErrorCode) => void;
};

export type MessageObjectName = "RC:TxtMsg" | "RC:FileMsg" | "RC:ImgMsg" | string;

export enum MessageObjectNames {
  text = "RC:TxtMsg",
  image = "RC:ImgMsg",
  file = "RC:FileMsg"
}

/**
 * 发送消息
 *
 * @param message 消息
 * @param callback 回调
 */
export function sendMessage(message: SentMessage, callback: SentMessageCallback = null) {
  const eventId = Math.random().toString();
  if (callback) {
    const listener = eventEmitter.addListener("rcimlib-send-message", data => {
      if (data.eventId === eventId) {
        const { success, error } = callback;
        if (data.type === "success") {
          success && success(data.messageId);
          listener.remove();
        } else if (data.type === "error") {
          error && error(data.errorCode);
          listener.remove();
        }
      }
    });
  }
  RCIMClient.sendMessage(message, eventId);
}

export enum ConnectErrorCode {
  RC_NET_CHANNEL_INVALID = 30001,
  RC_NET_UNAVAILABLE = 30002,
  RC_NAVI_REQUEST_FAIL = 30004,
  RC_NAVI_RESPONSE_ERROR = 30007,
  RC_NODE_NOT_FOUND = 30008,
  RC_SOCKET_NOT_CONNECTED = 30010,
  RC_SOCKET_DISCONNECTED = 30011,
  RC_PING_SEND_FAIL = 30012,
  RC_PONG_RECV_FAIL = 30013,
  RC_MSG_SEND_FAIL = 30014,
  RC_CONN_OVERFREQUENCY = 30015,
  RC_CONN_ACK_TIMEOUT = 31000,
  RC_CONN_PROTO_VERSION_ERROR = 31001,
  RC_CONN_ID_REJECT = 31002,
  RC_CONN_SERVER_UNAVAILABLE = 31003,
  RC_CONN_TOKEN_INCORRECT = 31004,
  RC_CONN_NOT_AUTHRORIZED = 31005,
  RC_CONN_REDIRECTED = 31006,
  RC_CONN_PACKAGE_NAME_INVALID = 31007,
  RC_CONN_APP_BLOCKED_OR_DELETED = 31008,
  RC_CONN_USER_BLOCKED = 31009,
  RC_DISCONN_KICK = 31010,
  RC_CONN_OTHER_DEVICE_LOGIN = 31023,
  RC_CONN_REFUSED = 32061,
  RC_CLIENT_NOT_INIT = 33001,
  RC_INVALID_PARAMETER = 33003,
  RC_CONNECTION_EXIST = 34001,
  RC_BACKGROUND_CONNECT = 34002,
  RC_INVALID_ARGUMENT = -1000
}

export enum ErrorCode {
  ERRORCODE_UNKNOWN = -1,
  REJECTED_BY_BLACKLIST = 405,
  ERRORCODE_TIMEOUT = 5004,
  SEND_MSG_FREQUENCY_OVERRUN = 20604,
  NOT_IN_DISCUSSION = 21406,
  NOT_IN_GROUP = 22406,
  FORBIDDEN_IN_GROUP = 22408,
  NOT_IN_CHATROOM = 23406,
  FORBIDDEN_IN_CHATROOM = 23408,
  KICKED_FROM_CHATROOM = 23409,
  RC_CHATROOM_NOT_EXIST = 23410,
  RC_CHATROOM_IS_FULL = 23411,
  RC_PARAMETER_INVALID_CHATROOM = 23412,
  RC_ROAMING_SERVICE_UNAVAILABLE_CHATROOM = 23414,
  RC_CHANNEL_INVALID = 30001,
  RC_NETWORK_UNAVAILABLE = 30002,
  RC_MSG_RESPONSE_TIMEOUT = 30003,
  CLIENT_NOT_INIT = 33001,
  DATABASE_ERROR = 33002,
  INVALID_PARAMETER = 33003,
  MSG_ROAMING_SERVICE_UNAVAILABLE = 33007,
  INVALID_PUBLIC_NUMBER = 29201,
  RC_MSG_SIZE_OUT_OF_LIMIT = 30016,
  RC_RECALLMESSAGE_PARAMETER_INVALID = 25101,
  RC_PUSHSETTING_PARAMETER_INVALID = 26001,
  RC_OPERATION_BLOCKED = 20605,
  RC_OPERATION_NOT_SUPPORT = 20606,
  RC_MSG_BLOCKED_SENSITIVE_WORD = 21501,
  RC_MSG_REPLACED_SENSITIVE_WORD = 21502,
  RC_SIGHT_MSG_DURATION_LIMIT_EXCEED = 34002
}

export enum ConnectionStatusIOS {
  UNKNOWN = -1,
  Connected = 0,
  NETWORK_UNAVAILABLE = 1,
  AIRPLANE_MODE = 2,
  Cellular_2G = 3,
  Cellular_3G_4G = 4,
  WIFI = 5,
  KICKED_OFFLINE_BY_OTHER_CLIENT = 6,
  LOGIN_ON_WEB = 7,
  SERVER_INVALID = 8,
  VALIDATE_INVALID = 9,
  Connecting = 10,
  Unconnected = 11,
  SignUp = 12,
  TOKEN_INCORRECT = 31004,
  DISCONN_EXCEPTION = 31011
}

export enum ConnectionStatusAndroid {
  NETWORK_UNAVAILABLE = -1,
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  KICKED_OFFLINE_BY_OTHER_CLIENT,
  TOKEN_INCORRECT,
  SERVER_INVALID
}

export type ConnectionStatus = ConnectionStatusIOS | ConnectionStatusAndroid;

/**
 * 添加消息监听函数
 */
export function addConnectionStatusListener(listener: (status: ConnectionStatus) => void) {
  return eventEmitter.addListener("rcimlib-connection-status", listener);
}

/**
 * 获取历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param objectName 消息对象名称，可以用 MessageObjectNames
 *     获取消息类型对应的对象名称
 * @param oldestMessageId 最近一条消息的 ID
 * @param count 数量
 */
export function getHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  objectName = "",
  oldestMessageId = -1,
  count = 10
): Promise<Message[]> {
  return RCIMClient.getHistoryMessages(
    conversationType,
    targetId,
    objectName,
    oldestMessageId,
    count
  );
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
    messageContent,
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

export type Conversation = {
  conversationType: ConversationType;
  conversationTitle: string;
  isTop: boolean;
  unreadMessageCount: number;
  draft: string;
  targetId: string;
  objectName: string;
  lastestMessageId: number;
  lastestMessage: MessageContent;
  receivedStatus: number;
  receivedTime: number;
  sentStatus: SentStatus;
  senderUserId: string;
};

export type SearchConversationResult = {
  conversation: Conversation;
  matchCount: number;
};

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
  objectNames: MessageObjectName[]
): Promise<SearchConversationResult[]> {
  return RCIMClient.searchConversations(keyword, conversationTypes, objectNames);
}

/**
 * 搜索消息
 *
 * @param conversationType
 * @param targetId
 * @param keyword
 * @param count
 * @param startTime
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
 * @param sentTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 */
export function cleanRemoteHistoryMessages(
  conversationType: ConversationType,
  targetId: string,
  sentTime: number
): Promise<boolean> {
  return RCIMClient.cleanRemoteHistoryMessages(conversationType, targetId, sentTime);
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
 * @param conversationTypes 会话类型
 */
export function getConversationList(
  conversationTypes: ConversationType[] = []
): Promise<Conversation[]> {
  return RCIMClient.getConversationList(conversationTypes);
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
 * 会话提醒状态
 */
export enum ConversationNotificationStatus {
  DO_NOT_DISTURB,
  NOTIFY
}

/**
 * 设置会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param notificationStatus 会话提醒状态
 */
export function setConversationNotificationStatus(
  conversationType: ConversationType,
  targetId: string,
  notificationStatus: ConversationNotificationStatus
): Promise<Conversation> {
  return RCIMClient.setConversationNotificationStatus(
    conversationType,
    targetId,
    notificationStatus
  );
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
): Promise<ConversationNotificationStatus> {
  return RCIMClient.getConversationNotificationStatus(conversationType, targetId);
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
 * 聊天室成员排序，按加入时间
 */
export enum ChatRoomMemberOrder {
  /**
   * 生序
   */
  ASC = 1,

  /**
   * 降序
   */
  DESC
}

/**
 * 聊天室成员信息
 */
export type MemberInfo = {
  userId: string;
  joinTime: number;
};

/**
 * 聊天室信息
 */
export type ChatRoomInfo = {
  targetId: string;
  memberOrder: ChatRoomMemberOrder;
  totalMemberCount: number;
  members: MemberInfo[];
};

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
 * 讨论组
 */
export type Discussion = {
  id: string;
  name: string;
  creatorId: string;
  memberIdList: string[];
  isOpen: boolean;
};

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
 * 搜索类型
 */
export enum SearchType {
  /**
   * 精准
   */
  EXACT,

  /**
   * 模糊
   */
  FUZZY
}

/**
 * 公共服务类型
 */
export enum PublicServiceType {
  /**
   * 应用公众服务
   */
  APP_PUBLIC_SERVICE = 7,

  /**
   * 公共服务号
   */
  PUBLIC_SERVICE = 8
}

/**
 * 公众服务菜单类型
 */
export enum PublicServiceMenuItemType {
  /**
   * 作为分组包含子菜单的菜单
   */
  GROUP,

  /**
   * 查看事件菜单
   */
  VIEW,

  /**
   * 点击事件菜单
   */
  CLICK
}

/**
 * 公众服务菜单项
 */
export type PublicServiceMenuItem = {
  id: string;
  name: string;
  url: string;
  type: PublicServiceMenuItemType;
};

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
) {
  return RCIMClient.searchPublicService(keyword, searchType, publicServiceType);
}
