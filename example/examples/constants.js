import { ConversationType } from "react-native-rongcloud-imlib";

export const conversations = {
  [ConversationType.PRIVATE]: "私聊",
  [ConversationType.DISCUSSION]: "讨论组",
  [ConversationType.GROUP]: "群组",
  [ConversationType.CHATROOM]: "聊天室",
  [ConversationType.CUSTOMER_SERVICE]: "客服"
};

export const messageTypes = { text: "文本消息", image: "图片消息", file: "文件消息" };
