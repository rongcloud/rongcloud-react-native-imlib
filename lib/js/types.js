"use strict";
exports.__esModule = true;
exports.PushLanguage = exports.CSMode = exports.CSEvaEntryPoint = exports.CSResolveStatus = exports.LeaveMessageType = exports.RealTimeLocationStatus = exports.ChatRoomMemberOrder = exports.TimestampOrder = exports.PublicServiceMenuItemType = exports.PublicServiceType = exports.SearchType = exports.ConnectionStatusAndroid = exports.ConnectionStatusIOS = exports.ErrorCode = exports.ConnectErrorCode = exports.MessageObjectNames = exports.ObjectName = exports.MentionedType = exports.SentStatus = exports.ConversationType = exports.MessageDirection = void 0;
/**
 * 消息方向
 */
var MessageDirection;
(function (MessageDirection) {
    MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
    MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
})(MessageDirection = exports.MessageDirection || (exports.MessageDirection = {}));
/**
 * 会话类型
 */
var ConversationType;
(function (ConversationType) {
    ConversationType[ConversationType["PRIVATE"] = 1] = "PRIVATE";
    ConversationType[ConversationType["DISCUSSION"] = 2] = "DISCUSSION";
    ConversationType[ConversationType["GROUP"] = 3] = "GROUP";
    ConversationType[ConversationType["CHATROOM"] = 4] = "CHATROOM";
    ConversationType[ConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
    ConversationType[ConversationType["SYSTEM"] = 6] = "SYSTEM";
    ConversationType[ConversationType["APP_SERVICE"] = 7] = "APP_SERVICE";
    ConversationType[ConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    ConversationType[ConversationType["PUSH_SERVICE"] = 9] = "PUSH_SERVICE";
})(ConversationType = exports.ConversationType || (exports.ConversationType = {}));
/**
 * 发送状态
 */
var SentStatus;
(function (SentStatus) {
    SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
    SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
    SentStatus[SentStatus["SENT"] = 30] = "SENT";
    SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
    SentStatus[SentStatus["READ"] = 50] = "READ";
    SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    SentStatus[SentStatus["CANCELED"] = 70] = "CANCELED";
})(SentStatus = exports.SentStatus || (exports.SentStatus = {}));
/**
 * 消息提醒类型
 */
var MentionedType;
(function (MentionedType) {
    /**
     * 提醒所有
     */
    MentionedType[MentionedType["ALL"] = 1] = "ALL";
    /**
     * 部分提醒
     */
    MentionedType[MentionedType["PART"] = 2] = "PART";
})(MentionedType = exports.MentionedType || (exports.MentionedType = {}));
/**
 * 消息对象名称
 */
var ObjectName;
(function (ObjectName) {
    /**
     * 文本消息
     */
    ObjectName["Text"] = "RC:TxtMsg";
    /**
     * 文件消息
     */
    ObjectName["File"] = "RC:FileMsg";
    /**
     * 图片消息
     */
    ObjectName["Image"] = "RC:ImgMsg";
    /**
     * GIF 图片消息
     */
    ObjectName["GIF"] = "RC:GIFMsg";
    /**
     * 位置信息
     */
    ObjectName["Location"] = "RC:LBSMsg";
    /**
     * 语音消息
     */
    ObjectName["Voice"] = "RC:VcMsg";
    /**
     * 高质量语音消息
     */
    ObjectName["HQVoice"] = "RC:HQVCMsg";
    /**
     * 小视频消息
     */
    ObjectName["Sight"] = "RC:SightMsg";
    /**
     * 命令消息
     */
    ObjectName["Command"] = "RC:CmdMsg";
    /**
     * 公众服务单图文消息
     */
    ObjectName["PublicServiceRich"] = "RC:PSImgTxtMsg";
    /**
     * 公众服务多图文消息
     */
    ObjectName["PublicServiceMultiRich"] = "RC:PSMultiImgTxtMsg";
    /**
     * 好友通知消息
     */
    ObjectName["ContactNotification"] = "RC:ContactNtf";
    /**
     * 资料通知消息
     */
    ObjectName["ProfileNotification"] = "RC:ProfileNtf";
    /**
     * 通用命令通知消息
     */
    ObjectName["CommandNotification"] = "RC:CmdNtf";
    /**
     * 提示条通知消息
     */
    ObjectName["InformationNotification"] = "RC:InfoNtf";
    /**
     * 群组通知消息
     */
    ObjectName["GroupNotification"] = "RC:GrpNtf";
    /**
     * 已读通知消息
     */
    ObjectName["ReadReceipt"] = "RC:ReadNtf";
    /**
     * 公众服务命令消息
     */
    ObjectName["PublicServiceCommand"] = "RC:PSCmd";
    /**
     * 对方正在输入状态消息
     */
    ObjectName["TypingStatus"] = "RC:TypSts";
    /**
     * 群消息已读状态回执
     */
    ObjectName["ReadReceiptResponse"] = "RC:RRRspMsg";
})(ObjectName = exports.ObjectName || (exports.ObjectName = {}));
/**
 * 消息对象名称枚举
 */
var MessageObjectNames;
(function (MessageObjectNames) {
    MessageObjectNames["text"] = "RC:TxtMsg";
    MessageObjectNames["image"] = "RC:ImgMsg";
    MessageObjectNames["file"] = "RC:FileMsg";
    MessageObjectNames["location"] = "RC:LocMsg";
    MessageObjectNames["voice"] = "RC:VcMsg";
})(MessageObjectNames = exports.MessageObjectNames || (exports.MessageObjectNames = {}));
/**
 * 连接错误代码
 */
var ConnectErrorCode;
(function (ConnectErrorCode) {
    ConnectErrorCode[ConnectErrorCode["RC_NET_CHANNEL_INVALID"] = 30001] = "RC_NET_CHANNEL_INVALID";
    ConnectErrorCode[ConnectErrorCode["RC_NET_UNAVAILABLE"] = 30002] = "RC_NET_UNAVAILABLE";
    ConnectErrorCode[ConnectErrorCode["RC_NAVI_REQUEST_FAIL"] = 30004] = "RC_NAVI_REQUEST_FAIL";
    ConnectErrorCode[ConnectErrorCode["RC_NAVI_RESPONSE_ERROR"] = 30007] = "RC_NAVI_RESPONSE_ERROR";
    ConnectErrorCode[ConnectErrorCode["RC_NODE_NOT_FOUND"] = 30008] = "RC_NODE_NOT_FOUND";
    ConnectErrorCode[ConnectErrorCode["RC_SOCKET_NOT_CONNECTED"] = 30010] = "RC_SOCKET_NOT_CONNECTED";
    ConnectErrorCode[ConnectErrorCode["RC_SOCKET_DISCONNECTED"] = 30011] = "RC_SOCKET_DISCONNECTED";
    ConnectErrorCode[ConnectErrorCode["RC_PING_SEND_FAIL"] = 30012] = "RC_PING_SEND_FAIL";
    ConnectErrorCode[ConnectErrorCode["RC_PONG_RECV_FAIL"] = 30013] = "RC_PONG_RECV_FAIL";
    ConnectErrorCode[ConnectErrorCode["RC_MSG_SEND_FAIL"] = 30014] = "RC_MSG_SEND_FAIL";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_OVERFREQUENCY"] = 30015] = "RC_CONN_OVERFREQUENCY";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_ACK_TIMEOUT"] = 31000] = "RC_CONN_ACK_TIMEOUT";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_PROTO_VERSION_ERROR"] = 31001] = "RC_CONN_PROTO_VERSION_ERROR";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_ID_REJECT"] = 31002] = "RC_CONN_ID_REJECT";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_SERVER_UNAVAILABLE"] = 31003] = "RC_CONN_SERVER_UNAVAILABLE";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_TOKEN_INCORRECT"] = 31004] = "RC_CONN_TOKEN_INCORRECT";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_NOT_AUTHRORIZED"] = 31005] = "RC_CONN_NOT_AUTHRORIZED";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_REDIRECTED"] = 31006] = "RC_CONN_REDIRECTED";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_PACKAGE_NAME_INVALID"] = 31007] = "RC_CONN_PACKAGE_NAME_INVALID";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_APP_BLOCKED_OR_DELETED"] = 31008] = "RC_CONN_APP_BLOCKED_OR_DELETED";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_USER_BLOCKED"] = 31009] = "RC_CONN_USER_BLOCKED";
    ConnectErrorCode[ConnectErrorCode["RC_DISCONN_KICK"] = 31010] = "RC_DISCONN_KICK";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_OTHER_DEVICE_LOGIN"] = 31023] = "RC_CONN_OTHER_DEVICE_LOGIN";
    ConnectErrorCode[ConnectErrorCode["RC_CONN_REFUSED"] = 32061] = "RC_CONN_REFUSED";
    ConnectErrorCode[ConnectErrorCode["RC_CLIENT_NOT_INIT"] = 33001] = "RC_CLIENT_NOT_INIT";
    ConnectErrorCode[ConnectErrorCode["RC_INVALID_PARAMETER"] = 33003] = "RC_INVALID_PARAMETER";
    ConnectErrorCode[ConnectErrorCode["RC_CONNECTION_EXIST"] = 34001] = "RC_CONNECTION_EXIST";
    ConnectErrorCode[ConnectErrorCode["RC_BACKGROUND_CONNECT"] = 34002] = "RC_BACKGROUND_CONNECT";
    ConnectErrorCode[ConnectErrorCode["RC_INVALID_ARGUMENT"] = -1000] = "RC_INVALID_ARGUMENT";
})(ConnectErrorCode = exports.ConnectErrorCode || (exports.ConnectErrorCode = {}));
/**
 * 错误代码
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["PARAMETER_ERROR"] = -3] = "PARAMETER_ERROR";
    ErrorCode[ErrorCode["ERRORCODE_UNKNOWN"] = -1] = "ERRORCODE_UNKNOWN";
    ErrorCode[ErrorCode["REJECTED_BY_BLACKLIST"] = 405] = "REJECTED_BY_BLACKLIST";
    ErrorCode[ErrorCode["ERRORCODE_TIMEOUT"] = 5004] = "ERRORCODE_TIMEOUT";
    ErrorCode[ErrorCode["SEND_MSG_FREQUENCY_OVERRUN"] = 20604] = "SEND_MSG_FREQUENCY_OVERRUN";
    ErrorCode[ErrorCode["NOT_IN_DISCUSSION"] = 21406] = "NOT_IN_DISCUSSION";
    ErrorCode[ErrorCode["NOT_IN_GROUP"] = 22406] = "NOT_IN_GROUP";
    ErrorCode[ErrorCode["FORBIDDEN_IN_GROUP"] = 22408] = "FORBIDDEN_IN_GROUP";
    ErrorCode[ErrorCode["NOT_IN_CHATROOM"] = 23406] = "NOT_IN_CHATROOM";
    ErrorCode[ErrorCode["FORBIDDEN_IN_CHATROOM"] = 23408] = "FORBIDDEN_IN_CHATROOM";
    ErrorCode[ErrorCode["KICKED_FROM_CHATROOM"] = 23409] = "KICKED_FROM_CHATROOM";
    ErrorCode[ErrorCode["CHATROOM_NOT_EXIST"] = 23410] = "CHATROOM_NOT_EXIST";
    ErrorCode[ErrorCode["CHATROOM_IS_FULL"] = 23411] = "CHATROOM_IS_FULL";
    ErrorCode[ErrorCode["PARAMETER_INVALID_CHATROOM"] = 23412] = "PARAMETER_INVALID_CHATROOM";
    ErrorCode[ErrorCode["ROAMING_SERVICE_UNAVAILABLE_CHATROOM"] = 23414] = "ROAMING_SERVICE_UNAVAILABLE_CHATROOM";
    ErrorCode[ErrorCode["CHANNEL_INVALID"] = 30001] = "CHANNEL_INVALID";
    ErrorCode[ErrorCode["NETWORK_UNAVAILABLE"] = 30002] = "NETWORK_UNAVAILABLE";
    ErrorCode[ErrorCode["MSG_RESPONSE_TIMEOUT"] = 30003] = "MSG_RESPONSE_TIMEOUT";
    ErrorCode[ErrorCode["CLIENT_NOT_INIT"] = 33001] = "CLIENT_NOT_INIT";
    ErrorCode[ErrorCode["DATABASE_ERROR"] = 33002] = "DATABASE_ERROR";
    ErrorCode[ErrorCode["INVALID_PARAMETER"] = 33003] = "INVALID_PARAMETER";
    ErrorCode[ErrorCode["MSG_ROAMING_SERVICE_UNAVAILABLE"] = 33007] = "MSG_ROAMING_SERVICE_UNAVAILABLE";
    ErrorCode[ErrorCode["INVALID_PUBLIC_NUMBER"] = 29201] = "INVALID_PUBLIC_NUMBER";
    ErrorCode[ErrorCode["MSG_SIZE_OUT_OF_LIMIT"] = 30016] = "MSG_SIZE_OUT_OF_LIMIT";
    ErrorCode[ErrorCode["RECALLMESSAGE_PARAMETER_INVALID"] = 25101] = "RECALLMESSAGE_PARAMETER_INVALID";
    ErrorCode[ErrorCode["PUSHSETTING_PARAMETER_INVALID"] = 26001] = "PUSHSETTING_PARAMETER_INVALID";
    ErrorCode[ErrorCode["OPERATION_BLOCKED"] = 20605] = "OPERATION_BLOCKED";
    ErrorCode[ErrorCode["OPERATION_NOT_SUPPORT"] = 20606] = "OPERATION_NOT_SUPPORT";
    ErrorCode[ErrorCode["MSG_BLOCKED_SENSITIVE_WORD"] = 21501] = "MSG_BLOCKED_SENSITIVE_WORD";
    ErrorCode[ErrorCode["MSG_REPLACED_SENSITIVE_WORD"] = 21502] = "MSG_REPLACED_SENSITIVE_WORD";
    ErrorCode[ErrorCode["SIGHT_MSG_DURATION_LIMIT_EXCEED"] = 34002] = "SIGHT_MSG_DURATION_LIMIT_EXCEED";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
/**
 * iOS 连接状态
 */
var ConnectionStatusIOS;
(function (ConnectionStatusIOS) {
    ConnectionStatusIOS[ConnectionStatusIOS["UNKNOWN"] = -1] = "UNKNOWN";
    ConnectionStatusIOS[ConnectionStatusIOS["Connected"] = 0] = "Connected";
    ConnectionStatusIOS[ConnectionStatusIOS["NETWORK_UNAVAILABLE"] = 1] = "NETWORK_UNAVAILABLE";
    ConnectionStatusIOS[ConnectionStatusIOS["AIRPLANE_MODE"] = 2] = "AIRPLANE_MODE";
    ConnectionStatusIOS[ConnectionStatusIOS["Cellular_2G"] = 3] = "Cellular_2G";
    ConnectionStatusIOS[ConnectionStatusIOS["Cellular_3G_4G"] = 4] = "Cellular_3G_4G";
    ConnectionStatusIOS[ConnectionStatusIOS["WIFI"] = 5] = "WIFI";
    ConnectionStatusIOS[ConnectionStatusIOS["KICKED_OFFLINE_BY_OTHER_CLIENT"] = 6] = "KICKED_OFFLINE_BY_OTHER_CLIENT";
    ConnectionStatusIOS[ConnectionStatusIOS["LOGIN_ON_WEB"] = 7] = "LOGIN_ON_WEB";
    ConnectionStatusIOS[ConnectionStatusIOS["SERVER_INVALID"] = 8] = "SERVER_INVALID";
    ConnectionStatusIOS[ConnectionStatusIOS["VALIDATE_INVALID"] = 9] = "VALIDATE_INVALID";
    ConnectionStatusIOS[ConnectionStatusIOS["Connecting"] = 10] = "Connecting";
    ConnectionStatusIOS[ConnectionStatusIOS["Unconnected"] = 11] = "Unconnected";
    ConnectionStatusIOS[ConnectionStatusIOS["SignUp"] = 12] = "SignUp";
    ConnectionStatusIOS[ConnectionStatusIOS["TOKEN_INCORRECT"] = 31004] = "TOKEN_INCORRECT";
    ConnectionStatusIOS[ConnectionStatusIOS["DISCONN_EXCEPTION"] = 31011] = "DISCONN_EXCEPTION";
})(ConnectionStatusIOS = exports.ConnectionStatusIOS || (exports.ConnectionStatusIOS = {}));
/**
 * Android 连接状态
 */
var ConnectionStatusAndroid;
(function (ConnectionStatusAndroid) {
    ConnectionStatusAndroid[ConnectionStatusAndroid["NETWORK_UNAVAILABLE"] = -1] = "NETWORK_UNAVAILABLE";
    ConnectionStatusAndroid[ConnectionStatusAndroid["CONNECTED"] = 0] = "CONNECTED";
    ConnectionStatusAndroid[ConnectionStatusAndroid["CONNECTING"] = 1] = "CONNECTING";
    ConnectionStatusAndroid[ConnectionStatusAndroid["DISCONNECTED"] = 2] = "DISCONNECTED";
    ConnectionStatusAndroid[ConnectionStatusAndroid["KICKED_OFFLINE_BY_OTHER_CLIENT"] = 3] = "KICKED_OFFLINE_BY_OTHER_CLIENT";
    ConnectionStatusAndroid[ConnectionStatusAndroid["TOKEN_INCORRECT"] = 4] = "TOKEN_INCORRECT";
    ConnectionStatusAndroid[ConnectionStatusAndroid["SERVER_INVALID"] = 5] = "SERVER_INVALID";
})(ConnectionStatusAndroid = exports.ConnectionStatusAndroid || (exports.ConnectionStatusAndroid = {}));
/**
 * 搜索类型
 */
var SearchType;
(function (SearchType) {
    /**
     * 精准
     */
    SearchType[SearchType["EXACT"] = 0] = "EXACT";
    /**
     * 模糊
     */
    SearchType[SearchType["FUZZY"] = 1] = "FUZZY";
})(SearchType = exports.SearchType || (exports.SearchType = {}));
/**
 * 公共服务类型
 */
var PublicServiceType;
(function (PublicServiceType) {
    /**
     * 应用公众服务
     */
    PublicServiceType[PublicServiceType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
    /**
     * 公共服务号
     */
    PublicServiceType[PublicServiceType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
})(PublicServiceType = exports.PublicServiceType || (exports.PublicServiceType = {}));
/**
 * 公众服务菜单类型
 */
var PublicServiceMenuItemType;
(function (PublicServiceMenuItemType) {
    /**
     * 作为分组包含子菜单的菜单
     */
    PublicServiceMenuItemType[PublicServiceMenuItemType["GROUP"] = 0] = "GROUP";
    /**
     * 查看事件菜单
     */
    PublicServiceMenuItemType[PublicServiceMenuItemType["VIEW"] = 1] = "VIEW";
    /**
     * 点击事件菜单
     */
    PublicServiceMenuItemType[PublicServiceMenuItemType["CLICK"] = 2] = "CLICK";
})(PublicServiceMenuItemType = exports.PublicServiceMenuItemType || (exports.PublicServiceMenuItemType = {}));
/**
 * 时间戳排序方式
 */
var TimestampOrder;
(function (TimestampOrder) {
    /**
     * 按时间戳倒序排序
     */
    TimestampOrder[TimestampOrder["DESC"] = 0] = "DESC";
    /**
     * 按时间戳顺序排序
     */
    TimestampOrder[TimestampOrder["ASC"] = 1] = "ASC";
})(TimestampOrder = exports.TimestampOrder || (exports.TimestampOrder = {}));
/**
 * 聊天室成员排序，按加入时间
 */
var ChatRoomMemberOrder;
(function (ChatRoomMemberOrder) {
    /**
     * 生序
     */
    ChatRoomMemberOrder[ChatRoomMemberOrder["ASC"] = 1] = "ASC";
    /**
     * 降序
     */
    ChatRoomMemberOrder[ChatRoomMemberOrder["DESC"] = 2] = "DESC";
})(ChatRoomMemberOrder = exports.ChatRoomMemberOrder || (exports.ChatRoomMemberOrder = {}));
/**
 * 实时位置共享状态
 */
var RealTimeLocationStatus;
(function (RealTimeLocationStatus) {
    /**
     * 初始状态
     */
    RealTimeLocationStatus[RealTimeLocationStatus["IDLE"] = 0] = "IDLE";
    /**
     * 接收状态
     */
    RealTimeLocationStatus[RealTimeLocationStatus["INCOMING"] = 1] = "INCOMING";
    /**
     * 发起状态
     */
    RealTimeLocationStatus[RealTimeLocationStatus["OUTGOING"] = 2] = "OUTGOING";
    /**
     * 已连接，正在共享的状态
     */
    RealTimeLocationStatus[RealTimeLocationStatus["CONNECTED"] = 3] = "CONNECTED";
})(RealTimeLocationStatus = exports.RealTimeLocationStatus || (exports.RealTimeLocationStatus = {}));
/**
 * 留言消息类型
 */
var LeaveMessageType;
(function (LeaveMessageType) {
    LeaveMessageType[LeaveMessageType["NATIVE"] = 0] = "NATIVE";
    LeaveMessageType[LeaveMessageType["WEB"] = 1] = "WEB";
})(LeaveMessageType = exports.LeaveMessageType || (exports.LeaveMessageType = {}));
/**
 * 客服问题解决状态
 */
var CSResolveStatus;
(function (CSResolveStatus) {
    CSResolveStatus[CSResolveStatus["UNRESOLVED"] = 0] = "UNRESOLVED";
    CSResolveStatus[CSResolveStatus["RESOLVED"] = 1] = "RESOLVED";
    CSResolveStatus[CSResolveStatus["RESOLVING"] = 2] = "RESOLVING";
})(CSResolveStatus = exports.CSResolveStatus || (exports.CSResolveStatus = {}));
/**
 * 客服评价时机
 */
var CSEvaEntryPoint;
(function (CSEvaEntryPoint) {
    CSEvaEntryPoint[CSEvaEntryPoint["LEAVE"] = 0] = "LEAVE";
    CSEvaEntryPoint[CSEvaEntryPoint["EXTENSION"] = 1] = "EXTENSION";
    CSEvaEntryPoint[CSEvaEntryPoint["NONE"] = 2] = "NONE";
    CSEvaEntryPoint[CSEvaEntryPoint["END"] = 3] = "END";
})(CSEvaEntryPoint = exports.CSEvaEntryPoint || (exports.CSEvaEntryPoint = {}));
/**
 * 客服服务模式
 */
var CSMode;
(function (CSMode) {
    CSMode[CSMode["NO_SERVICE"] = 0] = "NO_SERVICE";
    CSMode[CSMode["ROBOT_ONLY"] = 1] = "ROBOT_ONLY";
    CSMode[CSMode["HUMAN_ONLY"] = 2] = "HUMAN_ONLY";
    CSMode[CSMode["ROBOT_FIRST"] = 3] = "ROBOT_FIRST";
})(CSMode = exports.CSMode || (exports.CSMode = {}));
/**
 * 推送语言
 */
var PushLanguage;
(function (PushLanguage) {
    PushLanguage[PushLanguage["EN_US"] = 1] = "EN_US";
    PushLanguage[PushLanguage["ZH_CN"] = 2] = "ZH_CN";
})(PushLanguage = exports.PushLanguage || (exports.PushLanguage = {}));
