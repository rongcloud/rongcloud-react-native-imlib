"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getConversation = exports.deleteRemoteMessages = exports.cleanHistoryMessages = exports.cleanRemoteHistoryMessages = exports.getRemoteHistoryMessages = exports.getUnreadMentionedMessages = exports.getFirstUnreadMessage = exports.getMessageCount = exports.getMessageSendTime = exports.setMessageExtra = exports.getMessageByUId = exports.getMessage = exports.searchMessages = exports.searchConversations = exports.deleteMessages = exports.clearMessages = exports.insertIncomingMessage = exports.insertOutgoingMessage = exports.getHistoryMessages = exports.setReconnectKickEnable = exports.addConnectionStatusListener = exports.downloadMediaMessage = exports.cancelDownloadMediaMessage = exports.cancelSendMediaMessage = exports.addReceiptResponseListener = exports.addReceiptRequestListener = exports.addReadReceiptReceivedListener = exports.sendReadReceiptResponse = exports.sendReadReceiptRequest = exports.sendReadReceiptMessage = exports.getBlockedConversationList = exports.setMessageReceivedStatus = exports.setMessageSentStatus = exports.addTypingStatusListener = exports.sendTypingStatus = exports.recallMessage = exports.sendDirectionalMessage = exports.sendMediaMessage = exports.sendMessage = exports.addReceiveMessageListener = exports.getConnectionStatus = exports.disconnect = exports.connect = exports.setStatisticServer = exports.setServerInfo = exports.setDeviceToken = exports.syncConversationReadStatus = exports.addRecallMessageListener = exports.addLogInfoListener = exports.init = void 0;
exports.getCurrentUserId = exports.stopCustomerService = exports.leaveMessageCustomerService = exports.evaluateCustomerService = exports.selectCustomerServiceGroup = exports.switchToHumanMode = exports.startCustomerService = exports.setOfflineMessageDuration = exports.getOfflineMessageDuration = exports.removeNotificationQuietHours = exports.getNotificationQuietHours = exports.setNotificationQuietHours = exports.getRealTimeLocationParticipants = exports.getRealTimeLocationStatus = exports.quitRealTimeLocation = exports.joinRealTimeLocation = exports.startRealTimeLocation = exports.getPublicServiceProfile = exports.getPublicServiceList = exports.unsubscribePublicService = exports.subscribePublicService = exports.searchPublicService = exports.setDiscussionInviteStatus = exports.setDiscussionName = exports.removeMemberFromDiscussion = exports.addMemberToDiscussion = exports.quitDiscussion = exports.getDiscussion = exports.createDiscussion = exports.getChatRoomInfo = exports.getRemoteChatRoomHistoryMessages = exports.quitChatRoom = exports.joinExistChatRoom = exports.joinChatRoom = exports.getBlacklist = exports.getBlacklistStatus = exports.removeFromBlacklist = exports.addToBlacklist = exports.clearMessagesUnreadStatus = exports.getUnreadCount = exports.getTotalUnreadCount = exports.clearTextMessageDraft = exports.getTextMessageDraft = exports.saveTextMessageDraft = exports.getTopConversationList = exports.setConversationToTop = exports.getConversationNotificationStatus = exports.setConversationNotificationStatus = exports.removeConversation = exports.getConversationList = void 0;
exports.addPushArrivedListener = exports.getPushContentShowStatus = exports.setPushContentShowStatus = exports.setPushLanguage = void 0;
var react_native_1 = require("react-native");
var types_1 = require("./types");
__exportStar(require("./types"), exports);
var RCIMClient = react_native_1.NativeModules.RCIMClient;
var eventEmitter = new react_native_1.NativeEventEmitter(RCIMClient);
/**
 * 初始化 SDK，只需要调用一次
 *
 * @param appKey 从融云开发者平台创建应用后获取到的 App Key
 */
function init(appKey) {
    RCIMClient.init(appKey);
}
exports.init = init;
/**
 * 添加日志信息监听函数
 *
 * @param listener
 */
function addLogInfoListener(listener) {
    return eventEmitter.addListener("rcimlib-log", listener);
}
exports.addLogInfoListener = addLogInfoListener;
/**
 * 添加消息撤回监听函数
 *
 * @param listener
 */
function addRecallMessageListener(listener) {
    return eventEmitter.addListener("rcimlib-recall", listener);
}
exports.addRecallMessageListener = addRecallMessageListener;
/**
 * 同步会话阅读状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param timestamp 该会话中已读的最后一条消息的发送时间戳
 */
function syncConversationReadStatus(conversationType, targetId, timestamp) {
    return RCIMClient.syncConversationReadStatus(conversationType, targetId, timestamp);
}
exports.syncConversationReadStatus = syncConversationReadStatus;
/**
 * 设置 deviceToken，用于远程推送
 *
 * @param deviceToken 从系统获取到的设备号 deviceToken（需要去掉空格和尖括号）
 *
 *   deviceToken是系统提供的，从苹果服务器获取的，用于APNs远程推送必须使用的设备唯一值。
 *   您需要将 `-application:didRegisterForRemoteNotificationsWithDeviceToken:`
 *   获取到的deviceToken，转为NSString类型，并去掉其中的空格和尖括号，作为参数传入此方法。
 */
function setDeviceToken(deviceToken) {
    RCIMClient.setDeviceToken(deviceToken);
}
exports.setDeviceToken = setDeviceToken;
/**
 * 设置导航服务器和上传文件服务器信息，要在 [[init]] 前使用
 *
 * @param naviServer 导航服务器地址
 * @param fileServer 文件服务器地址
 */
function setServerInfo(naviServer, fileServer) {
    RCIMClient.setServerInfo(naviServer, fileServer);
}
exports.setServerInfo = setServerInfo;
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
function setStatisticServer(server) {
    RCIMClient.setStatisticServer(server);
}
exports.setStatisticServer = setStatisticServer;
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
function connect(token, success, error, tokenIncorrect) {
    if (success === void 0) { success = null; }
    if (error === void 0) { error = null; }
    if (tokenIncorrect === void 0) { tokenIncorrect = null; }
    var eventId = Math.random().toString();
    var listener = eventEmitter.addListener("rcimlib-connect", function (data) {
        if (data.eventId === eventId) {
            if (data.type === "success") {
                success && success(data.userId);
            }
            else if (data.type === "error") {
                error && error(data.errorCode);
            }
            else if (data.type === "tokenIncorrect") {
                tokenIncorrect && tokenIncorrect();
            }
            listener.remove();
        }
    });
    RCIMClient.connect(token, eventId);
}
exports.connect = connect;
/**
 * 断开与融云服务器的连接
 *
 * @param isReceivePush 是否还接收推送
 */
function disconnect(isReceivePush) {
    if (isReceivePush === void 0) { isReceivePush = true; }
    RCIMClient.disconnect(isReceivePush);
}
exports.disconnect = disconnect;
/**
 * 获取当前连接状态
 */
function getConnectionStatus() {
    return RCIMClient.getConnectionStatus();
}
exports.getConnectionStatus = getConnectionStatus;
/**
 * 添加消息监听函数
 */
function addReceiveMessageListener(listener) {
    return eventEmitter.addListener("rcimlib-receive-message", listener);
}
exports.addReceiveMessageListener = addReceiveMessageListener;
function handleSendMessageCallback(callback) {
    var eventId = Math.random().toString();
    if (callback) {
        var listener_1 = eventEmitter.addListener("rcimlib-send-message", function (data) {
            if (data.eventId === eventId) {
                var success = callback.success, error = callback.error, cancel = callback.cancel, progress = callback.progress;
                if (data.type === "success") {
                    success && success(data.messageId);
                    listener_1.remove();
                }
                else if (data.type === "error") {
                    error && error(data.errorCode, data.messageId, data.errorMessage);
                    listener_1.remove();
                }
                else if (data.type === "cancel") {
                    cancel && cancel();
                    listener_1.remove();
                }
                else if (data.type === "progress") {
                    progress && progress(data.progress, data.messageId);
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
function sendMessage(message, callback) {
    if (callback === void 0) { callback = {}; }
    message.content = handleMessageContent(message.content);
    RCIMClient.sendMessage(message, handleSendMessageCallback(callback));
}
exports.sendMessage = sendMessage;
/**
 * 发送媒体消息
 *
 * @param message 消息
 * @param callback 回调
 */
function sendMediaMessage(message, callback) {
    if (callback === void 0) { callback = {}; }
    message.content = handleMessageContent(message.content);
    RCIMClient.sendMediaMessage(message, handleSendMessageCallback(callback));
}
exports.sendMediaMessage = sendMediaMessage;
/**
 * 发送定向消息
 *
 * @param message 消息
 * @param userIdList 用户 ID 列表
 * @param callback 回调
 */
function sendDirectionalMessage(message, userIdList, callback) {
    message.content = handleMessageContent(message.content);
    RCIMClient.sendDirectionalMessage(message, handleSendMessageCallback(callback));
}
exports.sendDirectionalMessage = sendDirectionalMessage;
/**
 * 消息撤回
 *
 * @param messageId 消息 ID
 * @param pushContent 推送内容
 */
function recallMessage(messageId, pushContent) {
    if (pushContent === void 0) { pushContent = ""; }
    return RCIMClient.recallMessage(messageId, pushContent);
}
exports.recallMessage = recallMessage;
/**
 * 发送输入状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param typingContentType 输入内容类型
 */
function sendTypingStatus(conversationType, targetId, typingContentType) {
    RCIMClient.sendTypingStatus(conversationType, targetId, typingContentType);
}
exports.sendTypingStatus = sendTypingStatus;
/**
 * 添加输入状态监听函数
 */
function addTypingStatusListener(listener) {
    return eventEmitter.addListener("rcimlib-typing-status", listener);
}
exports.addTypingStatusListener = addTypingStatusListener;
/**
 * 设置消息发送状态
 *
 * @param messageId 消息 ID
 * @param status 状态
 */
function setMessageSentStatus(messageId, status) {
    return RCIMClient.setMessageSentStatus(messageId, status);
}
exports.setMessageSentStatus = setMessageSentStatus;
/**
 * 设置消息接收状态
 *
 * @param messageId 消息 ID
 * @param status 状态
 */
function setMessageReceivedStatus(messageId, status) {
    return RCIMClient.setMessageReceivedStatus(messageId, status);
}
exports.setMessageReceivedStatus = setMessageReceivedStatus;
/**
 * 获取屏蔽消息提醒的会话列表
 *
 * @param conversationTypeList 消息类型列表
 */
function getBlockedConversationList(conversationTypeList) {
    return RCIMClient.getBlockedConversationList(conversationTypeList);
}
exports.getBlockedConversationList = getBlockedConversationList;
/**
 * 发送阅读回执
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param timestamp 该会话中已阅读点最后一条消息的发送时间戳
 */
function sendReadReceiptMessage(conversationType, targetId, timestamp) {
    RCIMClient.sendReadReceiptMessage(conversationType, targetId, timestamp);
}
exports.sendReadReceiptMessage = sendReadReceiptMessage;
/**
 * 发起群组消息回执请求
 *
 * @param messageId 消息 ID
 */
function sendReadReceiptRequest(messageId) {
    return RCIMClient.sendReadReceiptRequest(messageId);
}
exports.sendReadReceiptRequest = sendReadReceiptRequest;
/**
 * 发起群组消息回执响应
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param messages 回执的消息列表
 */
function sendReadReceiptResponse(conversationType, targetId, messages) {
    return RCIMClient.sendReadReceiptResponse(conversationType, targetId, messages);
}
exports.sendReadReceiptResponse = sendReadReceiptResponse;
/**
 * 添加私聊阅读回执监听函数
 */
function addReadReceiptReceivedListener(listener) {
    return eventEmitter.addListener("rcimlib-read-receipt-received", listener);
}
exports.addReadReceiptReceivedListener = addReadReceiptReceivedListener;
/**
 * 添加收到消息已读回执请求监听函数
 *
 * 收到此请求后，如果用户阅读了对应的消息，需要调用
 * sendMessageReadReceiptResponse 接口发送已读响应
 */
function addReceiptRequestListener(listener) {
    return eventEmitter.addListener("rcimlib-receipt-request", listener);
}
exports.addReceiptRequestListener = addReceiptRequestListener;
/**
 * 添加消息回执响应监听函数
 *
 * @param listener
 */
function addReceiptResponseListener(listener) {
    return eventEmitter.addListener("rcimlib-receipt-response", listener);
}
exports.addReceiptResponseListener = addReceiptResponseListener;
/**
 * 取消发送中的媒体消息
 *
 * @param messageId 消息 ID
 */
function cancelSendMediaMessage(messageId) {
    return RCIMClient.cancelSendMediaMessage(messageId);
}
exports.cancelSendMediaMessage = cancelSendMediaMessage;
/**
 * 取消下载中的媒体消息
 *
 * @param messageId 消息 ID
 */
function cancelDownloadMediaMessage(messageId) {
    return RCIMClient.cancelDownloadMediaMessage(messageId);
}
exports.cancelDownloadMediaMessage = cancelDownloadMediaMessage;
/**
 * 下载媒体消息
 *
 * @param messageId 消息 ID
 * @param callback 回调
 */
function downloadMediaMessage(messageId, callback) {
    if (callback === void 0) { callback = {}; }
    var eventId = Math.random().toString();
    var listener = eventEmitter.addListener("rcimlib-download-media-message", function (data) {
        if (callback) {
            if (data.eventId === eventId) {
                var success = callback.success, error = callback.error, progress = callback.progress, cancel = callback.cancel;
                if (data.type === "success") {
                    success && success(data.path);
                    listener.remove();
                }
                else if (data.type === "error") {
                    error && error(data.errorCode);
                    listener.remove();
                }
                else if (data.type === "progress") {
                    progress && progress(data.progress);
                }
                else if (data.type === "cancel") {
                    cancel && cancel();
                }
            }
        }
    });
    RCIMClient.downloadMediaMessage(messageId, eventId);
}
exports.downloadMediaMessage = downloadMediaMessage;
/**
 * 添加连接状态监听函数
 */
function addConnectionStatusListener(listener) {
    return eventEmitter.addListener("rcimlib-connection-status", listener);
}
exports.addConnectionStatusListener = addConnectionStatusListener;
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
function setReconnectKickEnable(enabled) {
    RCIMClient.setReconnectKickEnable(enabled);
}
exports.setReconnectKickEnable = setReconnectKickEnable;
function getHistoryMessages(conversationType, targetId, objectName, baseMessageId, count, isForward) {
    if (objectName === void 0) { objectName = null; }
    if (baseMessageId === void 0) { baseMessageId = -1; }
    if (count === void 0) { count = 10; }
    if (isForward === void 0) { isForward = true; }
    if (Array.isArray(objectName)) {
        return RCIMClient.getHistoryMessagesByTimestamp(conversationType, targetId, objectName, baseMessageId, count, isForward);
    }
    else {
        return RCIMClient.getHistoryMessages(conversationType, targetId, objectName, baseMessageId, count, isForward);
    }
}
exports.getHistoryMessages = getHistoryMessages;
/**
 * 消息内容兼容性处理
 */
function handleMessageContent(content) {
    if (!content.objectName) {
        // @ts-ignore
        content.objectName = types_1.MessageObjectNames[content.type];
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
function insertOutgoingMessage(conversationType, targetId, sentStatus, messageContent, sentTime) {
    if (sentTime === void 0) { sentTime = 0; }
    return RCIMClient.insertOutgoingMessage(conversationType, targetId, sentStatus, handleMessageContent(messageContent), sentTime);
}
exports.insertOutgoingMessage = insertOutgoingMessage;
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
function insertIncomingMessage(conversationType, targetId, senderUserId, receivedStatus, messageContent, sentTime) {
    if (sentTime === void 0) { sentTime = 0; }
    return RCIMClient.insertIncomingMessage(conversationType, targetId, senderUserId, receivedStatus, handleMessageContent(messageContent), sentTime);
}
exports.insertIncomingMessage = insertIncomingMessage;
/**
 * 清空某一会话的所有消息
 *
 * @param conversationType
 * @param targetId
 */
function clearMessages(conversationType, targetId) {
    return RCIMClient.clearMessages(conversationType, targetId);
}
exports.clearMessages = clearMessages;
function deleteMessages(typeOrIds, targetId) {
    if (targetId === void 0) { targetId = ""; }
    if (Array.isArray(typeOrIds)) {
        return RCIMClient.deleteMessagesByIds(typeOrIds);
    }
    return RCIMClient.deleteMessages(typeOrIds, targetId);
}
exports.deleteMessages = deleteMessages;
/**
 * 根据关键字搜索会话
 *
 * @param keyword 关键字
 * @param conversationTypes 会话类型数组
 * @param objectNames 对象名称数组
 */
function searchConversations(keyword, conversationTypes, objectNames) {
    return RCIMClient.searchConversations(keyword, conversationTypes, objectNames);
}
exports.searchConversations = searchConversations;
/**
 * 搜索消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param keyword 关键字
 * @param count 获取数量
 * @param startTime 开始时间
 */
function searchMessages(conversationType, targetId, keyword, count, startTime) {
    if (startTime === void 0) { startTime = 0; }
    return RCIMClient.searchMessages(conversationType, targetId, keyword, count, startTime);
}
exports.searchMessages = searchMessages;
/**
 * 获取消息
 *
 * @param messageId 消息 ID
 */
function getMessage(messageId) {
    return RCIMClient.getMessage(messageId);
}
exports.getMessage = getMessage;
/**
 * 根据消息 UID 获取消息
 *
 * @param messageUId 消息 UID
 */
function getMessageByUId(messageUId) {
    return RCIMClient.getMessageByUId(messageUId);
}
exports.getMessageByUId = getMessageByUId;
/**
 * 设置消息的附加信息
 *
 * @param messageId 消息 ID
 * @param extra 附加信息
 */
function setMessageExtra(messageId, extra) {
    return RCIMClient.setMessageExtra(messageId, extra);
}
exports.setMessageExtra = setMessageExtra;
/**
 * 获取消息发送时间
 *
 * @param messageId 消息 ID
 */
function getMessageSendTime(messageId) {
    return RCIMClient.getMessageSendTime(messageId);
}
exports.getMessageSendTime = getMessageSendTime;
/**
 * 获取会话中的消息数量
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getMessageCount(conversationType, targetId) {
    return RCIMClient.getMessageCount(conversationType, targetId);
}
exports.getMessageCount = getMessageCount;
/**
 * 获取会话里第一条未读消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getFirstUnreadMessage(conversationType, targetId) {
    return RCIMClient.getFirstUnreadMessage(conversationType, targetId);
}
exports.getFirstUnreadMessage = getFirstUnreadMessage;
/**
 * 获取会话中 @ 提醒自己的消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getUnreadMentionedMessages(conversationType, targetId) {
    return RCIMClient.getUnreadMentionedMessages(conversationType, targetId);
}
exports.getUnreadMentionedMessages = getUnreadMentionedMessages;
/**
 * 获取服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param sentTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 * @param count 删除数量
 */
function getRemoteHistoryMessages(conversationType, targetId, sentTime, count) {
    return RCIMClient.getRemoteHistoryMessages(conversationType, targetId, sentTime, count);
}
exports.getRemoteHistoryMessages = getRemoteHistoryMessages;
/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param recordTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 */
function cleanRemoteHistoryMessages(conversationType, targetId, recordTime) {
    return RCIMClient.cleanRemoteHistoryMessages(conversationType, targetId, recordTime);
}
exports.cleanRemoteHistoryMessages = cleanRemoteHistoryMessages;
/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param recordTime 清除消息截止时间戳，为 0 则清除会话所有服务端历史消息
 * @param clearRemote 是否同时删除服务端消息
 */
function cleanHistoryMessages(conversationType, targetId, recordTime, clearRemote) {
    return RCIMClient.cleanHistoryMessages(conversationType, targetId, recordTime, clearRemote);
}
exports.cleanHistoryMessages = cleanHistoryMessages;
/**
 * 清除服务端历史消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param messages 要删除的消息数组，数组大小不能超过 100 条
 */
function deleteRemoteMessages(conversationType, targetId, messages) {
    return RCIMClient.deleteRemoteMessages(conversationType, targetId, messages);
}
exports.deleteRemoteMessages = deleteRemoteMessages;
/**
 * 获取会话
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getConversation(conversationType, targetId) {
    return RCIMClient.getConversation(conversationType, targetId);
}
exports.getConversation = getConversation;
/**
 * 获取会话列表
 *
 * @param conversationTypes 会话类型列表
 * @param count 获取的数量
 * @param timestamp 会话的时间戳（获取这个时间戳之前的会话列表，0
 *     表示从最新开始获取）
 */
function getConversationList(conversationTypes, count, timestamp) {
    if (conversationTypes === void 0) { conversationTypes = []; }
    if (count === void 0) { count = 0; }
    if (timestamp === void 0) { timestamp = 0; }
    return RCIMClient.getConversationList(conversationTypes, count, timestamp);
}
exports.getConversationList = getConversationList;
/**
 * 从会话列表中移除某一会话，但是不删除会话内的消息
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function removeConversation(conversationType, targetId) {
    return RCIMClient.removeConversation(conversationType, targetId);
}
exports.removeConversation = removeConversation;
/**
 * 设置会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param isBlock 是否屏蔽
 */
function setConversationNotificationStatus(conversationType, targetId, isBlock) {
    return RCIMClient.setConversationNotificationStatus(conversationType, targetId, isBlock);
}
exports.setConversationNotificationStatus = setConversationNotificationStatus;
/**
 * 获取会话消息提醒状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getConversationNotificationStatus(conversationType, targetId) {
    return RCIMClient.getConversationNotificationStatus(conversationType, targetId);
}
exports.getConversationNotificationStatus = getConversationNotificationStatus;
/**
 * 设置是否置顶会话
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param isTop 是否置顶
 */
function setConversationToTop(conversationType, targetId, isTop) {
    return RCIMClient.setConversationToTop(conversationType, targetId, isTop);
}
exports.setConversationToTop = setConversationToTop;
/**
 * 获取置顶会话列表
 *
 * @param conversationTypes 会话类型列表
 */
function getTopConversationList(conversationTypes) {
    if (conversationTypes === void 0) { conversationTypes = []; }
    return RCIMClient.getTopConversationList(conversationTypes);
}
exports.getTopConversationList = getTopConversationList;
/**
 * 保存某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param content 草稿内容
 */
function saveTextMessageDraft(conversationType, targetId, content) {
    return RCIMClient.saveTextMessageDraft(conversationType, targetId, content);
}
exports.saveTextMessageDraft = saveTextMessageDraft;
/**
 * 获取某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getTextMessageDraft(conversationType, targetId) {
    return RCIMClient.getTextMessageDraft(conversationType, targetId);
}
exports.getTextMessageDraft = getTextMessageDraft;
/**
 * 清除某一会话的文本消息草稿
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function clearTextMessageDraft(conversationType, targetId) {
    return RCIMClient.clearTextMessageDraft(conversationType, targetId);
}
exports.clearTextMessageDraft = clearTextMessageDraft;
/**
 * 获取所有未读消息数
 */
function getTotalUnreadCount() {
    return RCIMClient.getTotalUnreadCount();
}
exports.getTotalUnreadCount = getTotalUnreadCount;
function getUnreadCount(conversationType, targetId) {
    if (targetId === void 0) { targetId = ""; }
    if (Array.isArray(conversationType)) {
        return RCIMClient.getUnreadCount(0, "", conversationType);
    }
    return RCIMClient.getUnreadCount(conversationType, targetId, []);
}
exports.getUnreadCount = getUnreadCount;
/**
 * 清除某个会话中的未读消息数
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 * @param time 该会话已阅读的最后一条消息的发送时间戳
 */
function clearMessagesUnreadStatus(conversationType, targetId, time) {
    if (time === void 0) { time = 0; }
    return RCIMClient.clearMessagesUnreadStatus(conversationType, targetId, time);
}
exports.clearMessagesUnreadStatus = clearMessagesUnreadStatus;
/**
 * 把用户加入黑名单
 *
 * @param userId 用户 ID
 */
function addToBlacklist(userId) {
    return RCIMClient.addToBlacklist(userId);
}
exports.addToBlacklist = addToBlacklist;
/**
 * 把用户从黑名单种移除
 *
 * @param userId 用户 ID
 */
function removeFromBlacklist(userId) {
    return RCIMClient.removeFromBlacklist(userId);
}
exports.removeFromBlacklist = removeFromBlacklist;
/**
 * 获取某用户是否在黑名单中
 *
 * @param userId 用户 ID
 * @return 是否在黑名单中
 */
function getBlacklistStatus(userId) {
    return RCIMClient.getBlacklistStatus(userId);
}
exports.getBlacklistStatus = getBlacklistStatus;
/**
 * 获取黑名单列表
 *
 * @return 黑名单列表
 */
function getBlacklist() {
    return RCIMClient.getBlacklist();
}
exports.getBlacklist = getBlacklist;
/**
 * 加入聊天室，如果已存在，直接加入，否则创建并加入
 *
 * @param targetId 聊天室 ID
 * @param messageCount 默认获取的消息数量，最多 50
 */
function joinChatRoom(targetId, messageCount) {
    if (messageCount === void 0) { messageCount = 10; }
    return RCIMClient.joinChatRoom(targetId, messageCount);
}
exports.joinChatRoom = joinChatRoom;
/**
 * 加入已存在的聊天室，如果不存在则加入失败
 *
 * @param targetId 聊天室 ID
 * @param messageCount 默认获取的消息数量，最多 50
 */
function joinExistChatRoom(targetId, messageCount) {
    if (messageCount === void 0) { messageCount = 10; }
    return RCIMClient.joinExistChatRoom(targetId, messageCount);
}
exports.joinExistChatRoom = joinExistChatRoom;
/**
 * 退出聊天室
 *
 * @param targetId 聊天室 ID
 */
function quitChatRoom(targetId) {
    return RCIMClient.quitChatRoom(targetId);
}
exports.quitChatRoom = quitChatRoom;
/**
 * 从服务器端获取聊天室的历史消息
 *
 * @param targetId 目标 ID
 * @param recordTime 起始的消息发送时间戳，单位毫秒
 * @param count 要获取的消息数量
 * @param order 拉取顺序
 */
function getRemoteChatRoomHistoryMessages(targetId, recordTime, count, order) {
    return RCIMClient.getRemoteChatRoomHistoryMessages(targetId, recordTime, count, order);
}
exports.getRemoteChatRoomHistoryMessages = getRemoteChatRoomHistoryMessages;
/**
 * 获取聊天室信息
 *
 * @param targetId 聊天室 ID
 * @param memberCount 聊天室成员数量，最多获取 20 个
 * @param order 返回的聊天室成员排序方式
 */
function getChatRoomInfo(targetId, memberCount, order) {
    if (memberCount === void 0) { memberCount = 20; }
    if (order === void 0) { order = types_1.ChatRoomMemberOrder.ASC; }
    return RCIMClient.getChatRoomInfo(targetId, memberCount, order);
}
exports.getChatRoomInfo = getChatRoomInfo;
/**
 * 创建讨论组
 *
 * @param name 讨论组名称
 * @param userList 用户 ID 列表
 */
function createDiscussion(name, userList) {
    return RCIMClient.createDiscussion(name, userList);
}
exports.createDiscussion = createDiscussion;
/**
 * 获取讨论组信息
 *
 * @param targetId 讨论组 ID
 */
function getDiscussion(targetId) {
    return RCIMClient.getDiscussion(targetId);
}
exports.getDiscussion = getDiscussion;
/**
 * 退出讨论组
 *
 * @param targetId 讨论组 ID
 */
function quitDiscussion(targetId) {
    return RCIMClient.quitDiscussion(targetId);
}
exports.quitDiscussion = quitDiscussion;
/**
 * 把用户加入讨论组
 *
 * @param targetId 讨论组 ID
 * @param userList 用户 ID 列表
 */
function addMemberToDiscussion(targetId, userList) {
    return RCIMClient.addMemberToDiscussion(targetId, userList);
}
exports.addMemberToDiscussion = addMemberToDiscussion;
/**
 * 把用户从讨论组移出
 *
 * @param targetId 讨论组 ID
 * @param user 用户 ID
 */
function removeMemberFromDiscussion(targetId, user) {
    return RCIMClient.removeMemberFromDiscussion(targetId, user);
}
exports.removeMemberFromDiscussion = removeMemberFromDiscussion;
/**
 * 设置讨论组名称
 *
 * @param targetId 讨论组 ID
 * @param name 讨论组名称
 */
function setDiscussionName(targetId, name) {
    return RCIMClient.setDiscussionName(targetId, name);
}
exports.setDiscussionName = setDiscussionName;
/**
 * 设置讨论组拉人权限
 *
 * @param targetId 讨论组 ID
 * @param isOpen 是否开放拉人权限
 */
function setDiscussionInviteStatus(targetId, isOpen) {
    return RCIMClient.setDiscussionInviteStatus(targetId, isOpen);
}
exports.setDiscussionInviteStatus = setDiscussionInviteStatus;
/**
 * 搜索公众服务
 *
 * @param keyword 关键字
 * @param searchType 搜索类型
 * @param publicServiceType 公众服务类型
 */
function searchPublicService(keyword, searchType, publicServiceType) {
    if (searchType === void 0) { searchType = types_1.SearchType.FUZZY; }
    if (publicServiceType === void 0) { publicServiceType = 0; }
    return RCIMClient.searchPublicService(keyword, searchType, publicServiceType);
}
exports.searchPublicService = searchPublicService;
/**
 * 订阅公共服务
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
function subscribePublicService(publicServiceType, publicServiceId) {
    return RCIMClient.subscribePublicService(publicServiceType, publicServiceId);
}
exports.subscribePublicService = subscribePublicService;
/**
 * 取消关注公共服务
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
function unsubscribePublicService(publicServiceType, publicServiceId) {
    return RCIMClient.unsubscribePublicService(publicServiceType, publicServiceId);
}
exports.unsubscribePublicService = unsubscribePublicService;
/**
 * 获取已订阅的公众服务列表
 */
function getPublicServiceList() {
    return RCIMClient.getPublicServiceList();
}
exports.getPublicServiceList = getPublicServiceList;
/**
 * 获取单个公众服务信息
 *
 * @param publicServiceType 公共服务类型
 * @param publicServiceId 公共服务 ID
 */
function getPublicServiceProfile(publicServiceType, publicServiceId) {
    return RCIMClient.getPublicServiceProfile(publicServiceType, publicServiceId);
}
exports.getPublicServiceProfile = getPublicServiceProfile;
/**
 * 发起实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function startRealTimeLocation(conversationType, targetId) {
    return RCIMClient.startRealTimeLocation(conversationType, targetId);
}
exports.startRealTimeLocation = startRealTimeLocation;
/**
 * 加入实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function joinRealTimeLocation(conversationType, targetId) {
    return RCIMClient.joinRealTimeLocation(conversationType, targetId);
}
exports.joinRealTimeLocation = joinRealTimeLocation;
/**
 * 退出实时位置共享
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function quitRealTimeLocation(conversationType, targetId) {
    return RCIMClient.quitRealTimeLocation(conversationType, targetId);
}
exports.quitRealTimeLocation = quitRealTimeLocation;
/**
 * 获取实时位置共享状态
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getRealTimeLocationStatus(conversationType, targetId) {
    return RCIMClient.getRealTimeLocationStatus(conversationType, targetId);
}
exports.getRealTimeLocationStatus = getRealTimeLocationStatus;
/**
 * 获取参与实时位置共享的所有成员
 *
 * @param conversationType 会话类型
 * @param targetId 目标 ID
 */
function getRealTimeLocationParticipants(conversationType, targetId) {
    return RCIMClient.getRealTimeLocationParticipants(conversationType, targetId);
}
exports.getRealTimeLocationParticipants = getRealTimeLocationParticipants;
/**
 * 全局屏蔽某个时间段的消息提醒
 *
 * @param startTime 开始屏蔽消息提醒的时间，格式为HH:MM:SS
 * @param spanMinutes 需要屏蔽消息提醒的分钟数，0 < spanMinutes < 1440
 */
function setNotificationQuietHours(startTime, spanMinutes) {
    return RCIMClient.setNotificationQuietHours(startTime, spanMinutes);
}
exports.setNotificationQuietHours = setNotificationQuietHours;
/**
 * 查询已设置的全局时间段消息提醒屏蔽
 */
function getNotificationQuietHours() {
    return RCIMClient.getNotificationQuietHours();
}
exports.getNotificationQuietHours = getNotificationQuietHours;
/**
 * 删除已设置的全局时间段消息提醒屏蔽
 */
function removeNotificationQuietHours() {
    return RCIMClient.removeNotificationQuietHours();
}
exports.removeNotificationQuietHours = removeNotificationQuietHours;
/**
 * 获取离线消息在服务端的存储时间（以天为单位）
 */
function getOfflineMessageDuration() {
    return RCIMClient.getOfflineMessageDuration();
}
exports.getOfflineMessageDuration = getOfflineMessageDuration;
/**
 * 设置离线消息在服务端的存储时间（以天为单位）
 */
function setOfflineMessageDuration(duration) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = parseInt;
                    return [4 /*yield*/, RCIMClient.setOfflineMessageDuration(duration)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        });
    });
}
exports.setOfflineMessageDuration = setOfflineMessageDuration;
/**
 * 发起客服聊天
 *
 * @param kefuId 客服 ID
 * @param csInfo 客服信息
 * @param callback 回调
 */
function startCustomerService(kefuId, csInfo, callback) {
    if (callback === void 0) { callback = null; }
    var eventId = Math.random().toString();
    if (callback) {
        var success_1 = callback.success, error_1 = callback.error, modeChanged_1 = callback.modeChanged, selectGroup_1 = callback.selectGroup, pullEvaluation_1 = callback.pullEvaluation, quit_1 = callback.quit;
        var listener_2 = eventEmitter.addListener("rcimlib-customer-service", function (data) {
            if (data.eventId === eventId) {
                if (data.type === "success") {
                    success_1 && success_1(data.config);
                }
                else if (data.type === "error") {
                    error_1 && error_1(data.errorCode, data.errorMessage);
                    listener_2.remove();
                }
                else if (data.type === "mode-changed") {
                    modeChanged_1 && modeChanged_1(data.mode);
                }
                else if (data.type === "pull-evaluation") {
                    pullEvaluation_1 && pullEvaluation_1(data.dialogId);
                }
                else if (data.type === "select-group") {
                    selectGroup_1 && selectGroup_1(data.groups);
                }
                else if (data.type === "quit") {
                    quit_1 && quit_1(data.message);
                    listener_2.remove();
                }
            }
        });
    }
    RCIMClient.startCustomerService(kefuId, csInfo, eventId);
}
exports.startCustomerService = startCustomerService;
/**
 * 切换至人工客服
 *
 * @param kefuId 客服 ID
 */
function switchToHumanMode(kefuId) {
    RCIMClient.switchToHumanMode(kefuId);
}
exports.switchToHumanMode = switchToHumanMode;
/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param groupId 分组 ID
 */
function selectCustomerServiceGroup(kefuId, groupId) {
    RCIMClient.selectCustomServiceGroup(kefuId, groupId);
}
exports.selectCustomerServiceGroup = selectCustomerServiceGroup;
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
function evaluateCustomerService(kefuId, dialogId, value, suggest, resolveStatus, tagText, extra) {
    if (tagText === void 0) { tagText = null; }
    if (extra === void 0) { extra = null; }
    RCIMClient.evaluateCustomerService(kefuId, dialogId, value, suggest, resolveStatus, tagText, extra);
}
exports.evaluateCustomerService = evaluateCustomerService;
/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param message 客服留言信息
 */
function leaveMessageCustomerService(kefuId, message) {
    return RCIMClient.leaveMessageCustomerService(kefuId, message);
}
exports.leaveMessageCustomerService = leaveMessageCustomerService;
/**
 * 结束客服聊天
 *
 * @param kefuId 客服 ID
 */
function stopCustomerService(kefuId) {
    RCIMClient.stopCustomerService(kefuId);
}
exports.stopCustomerService = stopCustomerService;
/**
 * 获取当前用户 ID
 */
function getCurrentUserId() {
    return RCIMClient.getCurrentUserId();
}
exports.getCurrentUserId = getCurrentUserId;
/**
 * 设置推送语言
 *
 * @param language 推送语言
 */
function setPushLanguage(language) {
    return RCIMClient.setPushLanguage(language);
}
exports.setPushLanguage = setPushLanguage;
/**
 * 设置是否显示内容详情
 *
 * @param isShowPushContent 是否显示内容详情
 */
function setPushContentShowStatus(isShowPushContent) {
    return RCIMClient.setPushContentShowStatus(isShowPushContent);
}
exports.setPushContentShowStatus = setPushContentShowStatus;
/**
 * 查询是否显示内容详情
 */
function getPushContentShowStatus() {
    return RCIMClient.getPushContentShowStatus();
}
exports.getPushContentShowStatus = getPushContentShowStatus;
/**
 * 添加推送消息到达监听函数
 *
 * @param listener
 */
function addPushArrivedListener(listener) {
    return eventEmitter.addListener("rcimlib-push-arrived", listener);
}
exports.addPushArrivedListener = addPushArrivedListener;
