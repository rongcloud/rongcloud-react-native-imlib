import {
  ConversationType,
  PublicServiceType,
  SearchType,
  SentStatus,
  ObjectName
} from "@rongcloud/react-native-imlib";

export const conversations = {
  [ConversationType.PRIVATE]: "私聊",
  [ConversationType.DISCUSSION]: "讨论组",
  [ConversationType.GROUP]: "群组",
  [ConversationType.CHATROOM]: "聊天室",
  [ConversationType.CUSTOMER_SERVICE]: "客服"
};

export const messageTypes = {
  [ObjectName.Text]: "文本消息",
  [ObjectName.Image]: "图片消息",
  [ObjectName.File]: "文件消息",
  [ObjectName.Location]: "位置信息",
  [ObjectName.HQVoice]: "高清语音消息"
};

export const sentStatus = {
  [SentStatus.SENDING]: "发送中",
  [SentStatus.FAILED]: "发送失败",
  [SentStatus.SENT]: "已发送",
  [SentStatus.RECEIVED]: "对方已接收",
  [SentStatus.READ]: "对方已读",
  [SentStatus.DESTROYED]: "对方已销毁",
  [SentStatus.CANCELED]: "发送已取消"
};

export const conversationNotificationStatus = {
  true: "免打扰",
  false: "消息提醒"
};

export const searchTypes = {
  [SearchType.EXACT]: "精准匹配",
  [SearchType.FUZZY]: "模糊匹配"
};

export const publicServiceTypes = {
  0: "所有",
  [PublicServiceType.APP_PUBLIC_SERVICE]: "应用公众服务",
  [PublicServiceType.PUBLIC_SERVICE]: "公共服务"
};
