package cn.rongcloud.imlib.react;

import android.net.Uri;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import io.rong.imlib.CustomServiceConfig;
import io.rong.imlib.CustomServiceConfig.CSEvaSolveStatus;
import io.rong.imlib.ICustomServiceListener;
import io.rong.imlib.IRongCallback.IChatRoomHistoryMessageCallback;
import io.rong.imlib.IRongCallback.IDownloadMediaMessageCallback;
import io.rong.imlib.IRongCallback.ISendMediaMessageCallback;
import io.rong.imlib.RongCommonDefine.GetMessageDirection;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.RongIMClient.*;
import io.rong.imlib.location.RealTimeLocationConstant.RealTimeLocationErrorCode;
import io.rong.imlib.location.RealTimeLocationConstant.RealTimeLocationStatus;
import io.rong.imlib.model.*;
import io.rong.imlib.model.ChatRoomInfo.ChatRoomMemberOrder;
import io.rong.imlib.model.Conversation.ConversationNotificationStatus;
import io.rong.imlib.model.Conversation.ConversationType;
import io.rong.imlib.model.Conversation.PublicServiceType;
import io.rong.imlib.model.Message.ReceivedStatus;
import io.rong.imlib.model.Message.SentStatus;
import io.rong.imlib.typingmessage.TypingStatus;
import io.rong.message.*;

import javax.annotation.Nonnull;
import java.util.*;

@SuppressWarnings("unused")
public class RCIMClientModule extends ReactContextBaseJavaModule {
    private RCTDeviceEventEmitter eventEmitter;
    private ReactApplicationContext reactContext;

    RCIMClientModule(final ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        RongIMClient.setOnReceiveMessageListener(new OnReceiveMessageListener() {
            @Override
            public boolean onReceived(Message message, int left) {
                WritableMap map = Arguments.createMap();
                map.putMap("message", messageToMap(message));
                map.putInt("left", left);
                eventEmitter.emit("rcimlib-receive-message", map);
                return false;
            }
        });

        RongIMClient.setConnectionStatusListener(new ConnectionStatusListener() {
            @Override
            public void onChanged(ConnectionStatus status) {
                eventEmitter.emit("rcimlib-connection-status", status.getValue());
            }
        });

        RongIMClient.setTypingStatusListener(new TypingStatusListener() {
            @Override
            public void onTypingStatusChanged(ConversationType conversationType, String targetId, Collection<TypingStatus> set) {
                WritableMap map = Arguments.createMap();
                map.putInt("conversationType", conversationType.getValue());
                map.putString("targetId", targetId);
                if (set.size() > 0) {
                    Iterator iterator = set.iterator();
                    TypingStatus status = (TypingStatus) iterator.next();
                    map.putString("userId", status.getUserId());
                    map.putDouble("sentTime", status.getSentTime());
                    map.putString("typingContentType", status.getTypingContentType());
                    eventEmitter.emit("rcimlib-typing-status", map);
                } else {
                    eventEmitter.emit("rcimlib-typing-status", map);
                }
            }
        });

        RongIMClient.setReadReceiptListener(new ReadReceiptListener() {
            @Override
            public void onReadReceiptReceived(Message message) {
                eventEmitter.emit("rcimlib-read-receipt-received", messageToMap(message));
            }

            @Override
            public void onMessageReceiptRequest(ConversationType conversationType, String targetId, String UId) {
                WritableMap map = Arguments.createMap();
                map.putInt("conversationType", conversationType.getValue());
                map.putString("targetId", targetId);
                map.putString("messageUId", UId);
                eventEmitter.emit("rcimlib-receipt-request", map);
            }

            @Override
            public void onMessageReceiptResponse(ConversationType conversationType, String targetId, String UId, HashMap<String, Long> users) {
                WritableMap userIdList = Arguments.createMap();
                for (String userId : users.keySet()) {
                    Long readTime = users.get(userId);
                    if (readTime != null) {
                        userIdList.putDouble(userId, readTime);
                    }
                }
                WritableMap map = Arguments.createMap();
                map.putInt("conversationType", conversationType.getValue());
                map.putString("targetId", targetId);
                map.putString("messageUId", UId);
                map.putMap("usesIdList", userIdList);
                eventEmitter.emit("rcimlib-receipt-response", map);
            }
        });

        RongIMClient.setRCLogInfoListener(new RCLogInfoListener() {
            @Override
            public void onRCLogInfoOccurred(String log) {
                eventEmitter.emit("rcimlib-log", log);
            }
        });

        RongIMClient.setOnRecallMessageListener(new OnRecallMessageListener() {
            @Override
            public boolean onMessageRecalled(Message message, RecallNotificationMessage recall) {
                eventEmitter.emit("rcimlib-recall", message.getMessageId());
                return false;
            }
        });
    }

    @Nonnull
    @Override
    public String getName() {
        return "RCIMClient";
    }

    @ReactMethod
    public void init(String key) {
        eventEmitter = reactContext.getJSModule(RCTDeviceEventEmitter.class);
        RongIMClient.init(reactContext, key);
    }

    private WritableMap createEventMap(String eventId, String type) {
        WritableMap map = Arguments.createMap();
        map.putString("eventId", eventId);
        map.putString("type", type);
        return map;
    }

    private WritableMap messageToMap(Message message) {
        WritableMap map = Arguments.createMap();
        map.putInt("conversationType", message.getConversationType().getValue());
        map.putString("targetId", message.getTargetId());
        map.putString("messageUId", message.getUId());
        map.putInt("messageId", message.getMessageId());
        map.putInt("messageDirection", message.getMessageDirection().getValue());
        map.putString("senderUserId", message.getSenderUserId());
        map.putDouble("sentTime", (double) message.getSentTime());
        map.putDouble("receivedTime", (double) message.getReceivedTime());
        map.putInt("sentStatus", message.getSentStatus().getValue());
        map.putString("extra", message.getExtra());
        map.putString("objectName", message.getObjectName());
        String objectName = message.getObjectName();
        map.putMap("content", messageContentToMap(objectName, message.getContent()));
        return map;
    }

    private WritableMap messageContentToMap(String objectName, MessageContent content) {
        WritableMap map = Arguments.createMap();
        switch (objectName) {
            case "RC:TxtMsg":
                TextMessage text = (TextMessage) content;
                map.putString("type", "text");
                map.putString("content", text.getContent());
                map.putString("extra", text.getExtra());
                break;
            case "RC:ImgMsg": {
                ImageMessage image = (ImageMessage) content;
                String local = "";
                Uri localUri = image.getLocalUri();
                if (localUri != null) {
                    local = localUri.toString();
                }
                String remote = "";
                Uri remoteUri = image.getRemoteUri();
                if (remoteUri != null) {
                    remote = remoteUri.toString();
                }
                String thumbnail = "";
                Uri thumbnailUri = image.getThumUri();
                if (remoteUri != null) {
                    thumbnail = thumbnailUri.toString();
                }
                map.putString("type", "image");
                map.putString("local", local);
                map.putString("remote", remote);
                map.putString("thumbnail", thumbnail);
                map.putBoolean("isFull", image.isFull());
                map.putString("extra", image.getExtra());
                break;
            }
            case "RC:FileMsg": {
                FileMessage file = (FileMessage) content;
                String local = "";
                Uri localUri = file.getLocalPath();
                if (localUri != null) {
                    local = localUri.toString();
                }
                String remote = "";
                Uri remoteUri = file.getFileUrl();
                if (remoteUri != null) {
                    remote = remoteUri.toString();
                }
                map.putString("type", "file");
                map.putString("local", local);
                map.putString("remote", remote);
                map.putString("name", file.getName());
                map.putDouble("size", file.getSize());
                map.putString("fileType", file.getType());
                map.putString("extra", file.getExtra());
                break;
            }
            case "RC:LBSMsg": {
                LocationMessage location = (LocationMessage) content;
                Uri imageUri = location.getImgUri();
                map.putString("name", location.getPoi());
                map.putString("thumbnail", imageUri == null ? "" : imageUri.toString());
                map.putDouble("latitude", location.getLat());
                map.putDouble("longitude", location.getLng());
                map.putString("extra", location.getExtra());
                break;
            }
            case "RC:VcMsg": {
                VoiceMessage voice = (VoiceMessage) content;
                map.putString("local", voice.getUri().toString());
                map.putInt("duration", voice.getDuration());
                map.putString("extra", voice.getExtra());
                break;
            }
            case "RC:RcNtf": {
                RecallNotificationMessage message = (RecallNotificationMessage) content;
                map.putString("operatorId", message.getOperatorId());
                map.putDouble("recallTime", message.getRecallTime());
                map.putString("originalObjectName", message.getOriginalObjectName());
                map.putBoolean("isAdmin", message.isAdmin());
                break;
            }
        }
        return map;
    }

    @ReactMethod
    public void connect(String token, final String eventId) {
        RongIMClient.connect(token, new RongIMClient.ConnectCallback() {
            @Override
            public void onSuccess(String userId) {
                WritableMap map = createEventMap(eventId, "success");
                map.putString("userId", userId);
                eventEmitter.emit("rcimlib-connect", map);
            }

            @Override
            public void onError(RongIMClient.ErrorCode error) {
                WritableMap map = createEventMap(eventId, "error");
                map.putInt("errorCode", error.getValue());
                map.putString("errorMessage", error.getMessage());
                eventEmitter.emit("rcimlib-connect", map);
            }

            @Override
            public void onTokenIncorrect() {
                eventEmitter.emit("rcimlib-connect", createEventMap(eventId, "tokenIncorrect"));
            }
        });
    }

    @ReactMethod
    public void disconnect(Boolean isReceivePush) {
        if (isReceivePush) {
            RongIMClient.getInstance().disconnect();
        } else {
            RongIMClient.getInstance().logout();
        }
    }

    @ReactMethod
    public void setServerInfo(String naviServer, String fileServer) {
        RongIMClient.setServerInfo(naviServer, fileServer);
    }

    @SuppressWarnings("Duplicates")
    @ReactMethod
    public void sendMessage(ReadableMap data, final String eventId) {
        try {
            Message message = mapToMessage(data);
            String pushContent = getStringFromMap(data, "pushContent");
            String pushData = getStringFromMap(data, "pushData");
            RongIMClient.getInstance().sendMessage(message, pushContent, pushData, createSendMessageCallback(eventId));
        } catch (Exception e) {
            onSendMessageError(eventId, null, ErrorCode.PARAMETER_ERROR);
        }
    }

    @SuppressWarnings("Duplicates")
    @ReactMethod
    public void sendMediaMessage(ReadableMap data, final String eventId) {
        try {
            Message message = mapToMessage(data);
            String pushContent = getStringFromMap(data, "pushContent");
            String pushData = getStringFromMap(data, "pushData");
            RongIMClient.getInstance().sendMediaMessage(message, pushContent, pushData, createSendMessageCallback(eventId));
        } catch (Exception e) {
            onSendMessageError(eventId, null, ErrorCode.PARAMETER_ERROR);
        }
    }

    private ISendMediaMessageCallback createSendMessageCallback(final String eventId) {
        return new ISendMediaMessageCallback() {
            @Override
            public void onAttached(Message message) {
            }

            @Override
            public void onCanceled(Message message) {
                eventEmitter.emit("rcimlib-send-message", createEventMap(eventId, "cancel"));
            }

            @Override
            public void onSuccess(Message message) {
                WritableMap map = createEventMap(eventId, "success");
                map.putInt("messageId", message.getMessageId());
                eventEmitter.emit("rcimlib-send-message", map);
            }

            @Override
            public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                onSendMessageError(eventId, message, errorCode);
            }

            @Override
            public void onProgress(Message message, int i) {
                WritableMap map = createEventMap(eventId, "progress");
                map.putInt("messageId", message.getMessageId());
                map.putInt("progress", i);
                eventEmitter.emit("rcimlib-send-message", map);
            }
        };
    }

    @SuppressWarnings("Duplicates")
    @ReactMethod
    public void sendDirectionalMessage(ReadableMap data, ReadableArray users, final String eventId) {
        try {
            ConversationType conversationType = ConversationType.setValue(data.getInt("conversationType"));
            MessageContent messageContent = mapToMessageContent(data.getMap("content"));
            String targetId = data.getString("targetId");
            String pushContent = getStringFromMap(data, "pushContent");
            String pushData = getStringFromMap(data, "pushData");
            String[] array = toStringArray(users);
            RongIMClient.getInstance().sendDirectionalMessage(
                conversationType, targetId, messageContent, array, pushContent, pushData, createSendMessageCallback(eventId));
        } catch (Exception e) {
            onSendMessageError(eventId, null, ErrorCode.PARAMETER_ERROR);
        }
    }

    private void onSendMessageError(String eventId, Message message, RongIMClient.ErrorCode errorCode) {
        WritableMap map = createEventMap(eventId, "error");
        map.putInt("errorCode", errorCode.getValue());
        if (message != null) {
            map.putInt("messageId", message.getMessageId());
        }
        eventEmitter.emit("rcimlib-send-message", map);
    }

    private String getStringFromMap(ReadableMap map, String key) {
        String value = null;
        if (map.hasKey("pushContent")) {
            value = map.getString("pushContent");
        }
        return value;
    }

    private MessageContent mapToMessageContent(ReadableMap map) {
        if (map == null) {
            return null;
        }
        String contentType = map.getString("type");
        MessageContent messageContent = null;
        if (contentType != null) {
            switch (contentType) {
                case "text":
                    messageContent = TextMessage.obtain(map.getString("content"));
                    break;
                case "image":
                    Uri uri = Utils.getFileUri(reactContext, map.getString("local"));
                    messageContent = ImageMessage.obtain(uri, uri);
                    if (map.hasKey("isFull")) {
                        ((ImageMessage) messageContent).setIsFull(map.getBoolean("isFull"));
                    }
                    break;
                case "file":
                    messageContent = FileMessage.obtain(Utils.getFileUri(reactContext, map.getString("local")));
                    break;
                case "location":
                    Uri thumbnail = Utils.getFileUri(reactContext, map.getString("thumbnail"));
                    messageContent = LocationMessage.obtain(
                        map.getDouble("latitude"), map.getDouble("longitude"), map.getString("name"), thumbnail);
                    break;
                case "voice":
                    Uri voice = Utils.getFileUri(reactContext, map.getString("local"));
                    messageContent = VoiceMessage.obtain(voice, map.getInt("duration"));
                    break;
            }
        }
        return messageContent;
    }

    private Message mapToMessage(ReadableMap map) {
        ConversationType conversationType = ConversationType.setValue(map.getInt("conversationType"));
        MessageContent content = mapToMessageContent(map.getMap("content"));
        return Message.obtain(map.getString("targetId"), conversationType, content);
    }

    @ReactMethod
    public void recallMessage(int id, final String pushContent, final Promise promise) {
        RongIMClient.getInstance().getMessage(id, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().recallMessage(message, pushContent, new ResultCallback<RecallNotificationMessage>() {
                    @Override
                    public void onSuccess(RecallNotificationMessage message) {
                        promise.resolve(messageContentToMap("RC:RcNtf", message));
                    }

                    @Override
                    public void onError(ErrorCode errorCode) {
                        reject(promise, errorCode);
                    }
                });
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void getHistoryMessages(
        int type, String targetId, String objectName, int oldestMessageId, int count, boolean isForward, final Promise promise) {
        if (objectName == null || objectName.isEmpty()) {
            RongIMClient.getInstance().getHistoryMessages(
                ConversationType.setValue(type), targetId, oldestMessageId, count, createMessagesCallback(promise));
        } else {
            GetMessageDirection direction = isForward ? GetMessageDirection.FRONT : GetMessageDirection.BEHIND;
            RongIMClient.getInstance().getHistoryMessages(
                ConversationType.setValue(type), targetId, objectName, oldestMessageId, count, direction, createMessagesCallback(promise));
        }
    }

    @ReactMethod
    public void getHistoryMessagesByTimestamp(
        int type, String targetId, ReadableArray objectNames, double timestamp, int count, boolean isForward, final Promise promise) {
        if (objectNames == null || objectNames.size() == 0) {
            RongIMClient.getInstance().getHistoryMessages(
                ConversationType.setValue(type), targetId, (long) timestamp, count, 0, createMessagesCallback(promise));
        } else {
            GetMessageDirection direction = isForward ? GetMessageDirection.FRONT : GetMessageDirection.BEHIND;
            ArrayList<String> names = arrayToStringList(objectNames);
            RongIMClient.getInstance().getHistoryMessages(
                ConversationType.setValue(type), targetId, names, (long) timestamp, count, direction, createMessagesCallback(promise));
        }
    }

    @ReactMethod
    public void getRemoteHistoryMessages(int type, String targetId, double sentTime, int count, final Promise promise) {
        ResultCallback<List<Message>> callback = createMessagesCallback(promise);
        ConversationType conversationType = ConversationType.setValue(type);
        RongIMClient.getInstance().getRemoteHistoryMessages(conversationType, targetId, (long) sentTime, count, callback);
    }

    private ResultCallback<List<Message>> createMessagesCallback(final Promise promise) {
        return new ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> messages) {
                promise.resolve(messagesToArray(messages));
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    private ReadableArray messagesToArray(List<Message> messages) {
        WritableArray array = Arguments.createArray();
        if (messages != null) {
            for (Message message : messages) {
                array.pushMap(messageToMap(message));
            }
        }
        return array;
    }

    private ResultCallback<Message> createMessageCallback(final Promise promise) {
        return new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                if (message == null) {
                    promise.reject("", "获取消息失败");
                } else {
                    promise.resolve(messageToMap(message));
                }
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    @ReactMethod
    public void insertOutgoingMessage(int type, String targetId, int status, ReadableMap content, int sentTime, final Promise promise) {
        MessageContent messageContent = mapToMessageContent(content);
        SentStatus sentStatus = SentStatus.setValue(status);
        ConversationType conversationType = ConversationType.setValue(type);
        if (sentTime == 0) {
            RongIMClient.getInstance().insertOutgoingMessage(
                conversationType, targetId, sentStatus, messageContent, createMessageCallback(promise));
        } else {
            RongIMClient.getInstance().insertOutgoingMessage(
                conversationType, targetId, sentStatus, messageContent, sentTime, createMessageCallback(promise));
        }
    }

    @ReactMethod
    public void insertIncomingMessage(int type, String targetId, String senderId, int status, ReadableMap content, int sentTime, final Promise promise) {
        MessageContent messageContent = mapToMessageContent(content);
        ReceivedStatus receivedStatus = new ReceivedStatus(status);
        ConversationType conversationType = ConversationType.setValue(type);
        if (sentTime == 0) {
            RongIMClient.getInstance().insertIncomingMessage(
                conversationType, targetId, senderId, receivedStatus, messageContent, createMessageCallback(promise));
        } else {
            RongIMClient.getInstance().insertIncomingMessage(
                conversationType, targetId, senderId, receivedStatus, messageContent, sentTime, createMessageCallback(promise));
        }
    }

    @ReactMethod
    public void clearMessages(int type, String targetId, final Promise promise) {
        RongIMClient.getInstance().clearMessages(
            ConversationType.setValue(type), targetId, createBooleanCallback(promise));
    }

    @ReactMethod
    public void deleteMessages(int type, String targetId, final Promise promise) {
        RongIMClient.getInstance().deleteMessages(
            ConversationType.setValue(type), targetId, createBooleanCallback(promise));
    }

    @ReactMethod
    public void deleteMessagesByIds(ReadableArray ids, final Promise promise) {
        int[] array = new int[ids.size()];
        for (int i = 0; i < ids.size(); i += 1) {
            array[i] = ids.getInt(i);
        }
        RongIMClient.getInstance().deleteMessages(array, createBooleanCallback(promise));
    }

    @ReactMethod
    public void deleteMessages(int type, String targetId, ReadableArray messages, final Promise promise) {
        Message[] array = new Message[messages.size()];
        for (int i = 0; i < messages.size(); i += 1) {
            ReadableMap message = messages.getMap(i);
            if (message == null) {
                array[i] = null;
            } else {
                array[i] = mapToMessage(message);
            }
        }
        RongIMClient.getInstance().deleteRemoteMessages(
            ConversationType.setValue(type), targetId, array, new OperationCallback() {
                @Override
                public void onSuccess() {
                    promise.resolve(null);
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    private ResultCallback<Boolean> createBooleanCallback(final Promise promise) {
        return new ResultCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                promise.resolve(result);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    private String[] toStringArray(ReadableArray items) {
        String[] array = new String[items.size()];
        for (int i = 0; i < items.size(); i += 1) {
            array[i] = items.getString(i);
        }
        return array;
    }

    @ReactMethod
    public void searchConversations(String keyword, ReadableArray conversationTypes, ReadableArray objectNames, final Promise promise) {
        ConversationType[] conversationTypesArray = arrayToConversationTypes(conversationTypes);
        String[] objectNamesArray = toStringArray(conversationTypes);
        RongIMClient.getInstance().searchConversations(
            keyword, conversationTypesArray, objectNamesArray, new ResultCallback<List<SearchConversationResult>>() {
                @Override
                public void onSuccess(List<SearchConversationResult> conversations) {
                    WritableArray result = Arguments.createArray();
                    for (SearchConversationResult item : conversations) {
                        WritableMap map = Arguments.createMap();
                        map.putMap("conversation", conversationToMap(item.getConversation()));
                        map.putInt("matchCount", item.getMatchCount());
                    }
                    promise.resolve(result);
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    private WritableMap conversationToMap(Conversation conversation) {
        WritableMap map = Arguments.createMap();
        map.putInt("conversationType", conversation.getConversationType().getValue());
        map.putString("conversationTitle", conversation.getConversationTitle());
        map.putBoolean("isTop", conversation.isTop());
        map.putInt("unreadMessageCount", conversation.getUnreadMessageCount());
        map.putString("draft", conversation.getDraft());
        map.putString("targetId", conversation.getTargetId());
        map.putString("objectName", conversation.getObjectName());
        map.putInt("lastestMessageId", conversation.getLatestMessageId());
        map.putMap("lastestMessage", messageContentToMap(conversation.getObjectName(), conversation.getLatestMessage()));
        map.putInt("receivedStatus", conversation.getReceivedStatus().getFlag());
        map.putDouble("receivedTime", conversation.getReceivedTime());
        map.putInt("sentStatus", conversation.getSentStatus().getValue());
        map.putDouble("sentTime", conversation.getSentTime());
        map.putString("senderUserId", conversation.getSenderUserId());
        return map;
    }

    private void reject(Promise promise, ErrorCode errorcode) {
        promise.reject(errorcode.getValue() + "", errorcode.getMessage());
    }

    @ReactMethod
    public void searchMessages(int conversationType, String targetId, String keyword, int count, double startTime, final Promise promise) {
        ResultCallback<List<Message>> callback = createMessagesCallback(promise);
        RongIMClient.getInstance().searchMessages(
            ConversationType.setValue(conversationType), targetId, keyword, count, (long) startTime, callback);
    }

    @ReactMethod
    public void getConversation(int conversationType, String targetId, final Promise promise) {
        RongIMClient.getInstance().getConversation(
            ConversationType.setValue(conversationType), targetId, new ResultCallback<Conversation>() {
                @Override
                public void onSuccess(Conversation conversation) {
                    promise.resolve(conversationToMap(conversation));
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    private ConversationType[] arrayToConversationTypes(ReadableArray array) {
        ConversationType[] conversationTypesArray = new ConversationType[array.size()];
        for (int i = 0; i < array.size(); i += 1) {
            conversationTypesArray[i] = ConversationType.setValue(array.getInt(i));
        }
        return conversationTypesArray;
    }

    private ResultCallback<List<Conversation>> createConversationListCallback(final Promise promise) {
        return new ResultCallback<List<Conversation>>() {
            @Override
            public void onSuccess(List<Conversation> conversations) {
                WritableArray array = Arguments.createArray();
                for (Conversation conversation : conversations) {
                    array.pushMap(conversationToMap(conversation));
                }
                promise.resolve(array);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    @ReactMethod
    public void getConversationList(ReadableArray conversationTypes, int count, int timestamp, final Promise promise) {
        ConversationType[] types = arrayToConversationTypes(conversationTypes);
        ResultCallback<List<Conversation>> callback = createConversationListCallback(promise);
        if (types.length > 0) {
            if (count > 0) {
                RongIMClient.getInstance().getConversationListByPage(callback, timestamp, count, types);
            } else {
                RongIMClient.getInstance().getConversationList(callback, types);
            }
        } else {
            RongIMClient.getInstance().getConversationList(callback);
        }
    }

    @ReactMethod
    public void getBlockedConversationList(ReadableArray conversationTypes, final Promise promise) {
        ConversationType[] types = arrayToConversationTypes(conversationTypes);
        RongIMClient.getInstance().getBlockedConversationList(createConversationListCallback(promise), types);
    }

    @ReactMethod
    public void removeConversation(int conversationType, String targetId, final Promise promise) {
        RongIMClient.getInstance().removeConversation(
            ConversationType.setValue(conversationType), targetId, createBooleanCallback(promise));
    }

    private ResultCallback<ConversationNotificationStatus> createConversationNotificationStatusCallback(final Promise promise) {
        return new ResultCallback<ConversationNotificationStatus>() {
            @Override
            public void onSuccess(ConversationNotificationStatus status) {
                promise.resolve(status == ConversationNotificationStatus.DO_NOT_DISTURB);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    @ReactMethod
    public void setConversationNotificationStatus(int conversationType, String targetId, boolean isBlock, Promise promise) {
        RongIMClient.getInstance().setConversationNotificationStatus(
            ConversationType.setValue(conversationType),
            targetId,
            isBlock ? ConversationNotificationStatus.DO_NOT_DISTURB : ConversationNotificationStatus.NOTIFY,
            createConversationNotificationStatusCallback(promise));
    }

    @ReactMethod
    public void getConversationNotificationStatus(int conversationType, String targetId, Promise promise) {
        RongIMClient.getInstance().getConversationNotificationStatus(
            ConversationType.setValue(conversationType), targetId, createConversationNotificationStatusCallback(promise));
    }

    @ReactMethod
    public void saveTextMessageDraft(int conversationType, String targetId, String content, final Promise promise) {
        RongIMClient.getInstance().saveTextMessageDraft(
            ConversationType.setValue(conversationType), targetId, content, createBooleanCallback(promise));
    }

    @ReactMethod
    public void getTextMessageDraft(int conversationType, String targetId, final Promise promise) {
        RongIMClient.getInstance().getTextMessageDraft(
            ConversationType.setValue(conversationType), targetId, new ResultCallback<String>() {
                @Override
                public void onSuccess(String content) {
                    promise.resolve(content);
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    @ReactMethod
    public void getTotalUnreadCount(final Promise promise) {
        RongIMClient.getInstance().getTotalUnreadCount(new ResultCallback<Integer>() {
            @Override
            public void onSuccess(Integer count) {
                promise.resolve(count);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void getUnreadCount(int conversationType, String targetId, ReadableArray conversationTypes, final Promise promise) {
        ResultCallback<Integer> callback = new ResultCallback<Integer>() {
            @Override
            public void onSuccess(Integer count) {
                promise.resolve(count);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
        if (conversationType == 0) {
            ConversationType[] types = arrayToConversationTypes(conversationTypes);
            RongIMClient.getInstance().getUnreadCount(callback, types);
        } else {
            RongIMClient.getInstance().getUnreadCount(ConversationType.setValue(conversationType), targetId, callback);
        }
    }

    @ReactMethod
    public void clearMessagesUnreadStatus(int conversationType, String targetId, double time, final Promise promise) {
        if (time == 0) {
            RongIMClient.getInstance().clearMessagesUnreadStatus(
                ConversationType.setValue(conversationType), targetId, createBooleanCallback(promise));
        } else {
            RongIMClient.getInstance().clearMessagesUnreadStatus(
                ConversationType.setValue(conversationType), targetId, (long) time, new OperationCallback() {
                    @Override
                    public void onSuccess() {
                        promise.resolve(true);
                    }

                    @Override
                    public void onError(ErrorCode errorCode) {
                        reject(promise, errorCode);
                    }
                });
        }
    }

    private OperationCallback createOperationCallback(final Promise promise) {
        return new OperationCallback() {
            @Override
            public void onSuccess() {
                promise.resolve(null);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    @ReactMethod
    public void addToBlacklist(String userId, final Promise promise) {
        RongIMClient.getInstance().addToBlacklist(userId, createOperationCallback(promise));
    }

    @ReactMethod
    public void removeFromBlacklist(String userId, final Promise promise) {
        RongIMClient.getInstance().removeFromBlacklist(userId, createOperationCallback(promise));
    }

    @ReactMethod
    public void getBlacklistStatus(String userId, final Promise promise) {
        RongIMClient.getInstance().getBlacklistStatus(userId, new ResultCallback<BlacklistStatus>() {
            @Override
            public void onSuccess(BlacklistStatus status) {
                promise.resolve(status == BlacklistStatus.IN_BLACK_LIST);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void getBlacklist(final Promise promise) {
        RongIMClient.getInstance().getBlacklist(new GetBlacklistCallback() {
            @Override
            public void onSuccess(String[] strings) {
                WritableArray array = Arguments.createArray();
                for (String string : strings) {
                    array.pushString(string);
                }
                promise.resolve(array);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void joinChatRoom(String targetId, int messageCount, final Promise promise) {
        RongIMClient.getInstance().joinChatRoom(targetId, messageCount, createOperationCallback(promise));
    }

    @ReactMethod
    public void joinExistChatRoom(String targetId, int messageCount, final Promise promise) {
        RongIMClient.getInstance().joinExistChatRoom(targetId, messageCount, createOperationCallback(promise));
    }

    @ReactMethod
    public void quitChatRoom(String targetId, final Promise promise) {
        RongIMClient.getInstance().quitChatRoom(targetId, createOperationCallback(promise));
    }

    @ReactMethod
    public void getChatRoomInfo(String targetId, int memberCount, int order, final Promise promise) {
        ChatRoomMemberOrder memberOrder = order == ChatRoomMemberOrder.RC_CHAT_ROOM_MEMBER_ASC.getValue() ?
            ChatRoomMemberOrder.RC_CHAT_ROOM_MEMBER_ASC : ChatRoomMemberOrder.RC_CHAT_ROOM_MEMBER_DESC;
        RongIMClient.getInstance().getChatRoomInfo(targetId, memberCount, memberOrder, new ResultCallback<ChatRoomInfo>() {
            @Override
            public void onSuccess(ChatRoomInfo chatRoomInfo) {
                WritableMap map = Arguments.createMap();
                map.putString("targetId", chatRoomInfo.getChatRoomId());
                map.putInt("totalMemberCount", chatRoomInfo.getTotalMemberCount());
                map.putInt("memberOrder", chatRoomInfo.getMemberOrder().getValue());
                WritableArray array = Arguments.createArray();
                for (ChatRoomMemberInfo member : chatRoomInfo.getMemberInfo()) {
                    WritableMap item = Arguments.createMap();
                    item.putString("userId", member.getUserId());
                    item.putDouble("joinTime", member.getJoinTime());
                    array.pushMap(item);
                }
                map.putArray("members", array);
                promise.resolve(map);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void createDiscussion(String name, ReadableArray userList, final Promise promise) {
        userList.toArrayList();
        ArrayList<String> array = new ArrayList<>();
        for (int i = 0; i < userList.size(); i += 1) {
            array.add(userList.getString(i));
        }
        RongIMClient.getInstance().createDiscussion(name, array, new CreateDiscussionCallback() {
            @Override
            public void onSuccess(String targetId) {
                promise.resolve(targetId);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void getDiscussion(String targetId, final Promise promise) {
        RongIMClient.getInstance().getDiscussion(targetId, new ResultCallback<Discussion>() {
            @Override
            public void onSuccess(Discussion discussion) {
                WritableMap map = Arguments.createMap();
                map.putString("id", discussion.getId());
                map.putString("name", discussion.getName());
                map.putString("creatorId", discussion.getCreatorId());
                WritableArray members = Arguments.createArray();
                for (String member : discussion.getMemberIdList()) {
                    members.pushString(member);
                }
                map.putArray("memberIdList", members);
                map.putBoolean("isOpen", discussion.isOpen());
                promise.resolve(map);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void quitDiscussion(String targetId, final Promise promise) {
        RongIMClient.getInstance().quitDiscussion(targetId, createOperationCallback(promise));
    }

    @ReactMethod
    public void setDiscussionName(String targetId, String name, final Promise promise) {
        RongIMClient.getInstance().setDiscussionName(targetId, name, createOperationCallback(promise));
    }

    @ReactMethod
    public void setDiscussionInviteStatus(String targetId, Boolean isOpen, final Promise promise) {
        DiscussionInviteStatus status = isOpen ? DiscussionInviteStatus.OPENED : DiscussionInviteStatus.CLOSED;
        RongIMClient.getInstance().setDiscussionInviteStatus(targetId, status, createOperationCallback(promise));
    }

    @ReactMethod
    public void addMemberToDiscussion(String targetId, ReadableArray userList, final Promise promise) {
        ArrayList<String> array = new ArrayList<>();
        for (int i = 0; i < userList.size(); i += 1) {
            array.add(userList.getString(i));
        }
        RongIMClient.getInstance().addMemberToDiscussion(targetId, array, createOperationCallback(promise));
    }

    @ReactMethod
    public void removeMemberFromDiscussion(String targetId, String userId, final Promise promise) {
        RongIMClient.getInstance().removeMemberFromDiscussion(targetId, userId, createOperationCallback(promise));
    }

    private WritableArray menuItemsToArray(List<PublicServiceMenuItem> items) {
        WritableArray menu = Arguments.createArray();
        for (PublicServiceMenuItem menuItem : items) {
            WritableMap menuItemMap = Arguments.createMap();
            menuItemMap.putString("id", menuItem.getId());
            menuItemMap.putString("name", menuItem.getName());
            menuItemMap.putString("url", menuItem.getUrl());
            menuItemMap.putInt("type", menuItem.getType().getValue());
            List<PublicServiceMenuItem> subItems = menuItem.getSubMenuItems();
            if (subItems != null && subItems.size() > 0) {
                menuItemMap.putArray("submenu", menuItemsToArray(subItems));
            }
        }
        return menu;
    }

    private WritableMap publicServiceProfileToMap(PublicServiceProfile item) {
        if (item == null) {
            return null;
        }
        WritableMap map = Arguments.createMap();
        map.putString("id", item.getTargetId());
        map.putString("name", item.getName());
        map.putString("introduction", item.getIntroduction());
        map.putString("portraitUrl", item.getPortraitUri().toString());
        map.putBoolean("isGlobal", item.isGlobal());
        map.putBoolean("followed", item.isFollow());
        map.putInt("type", item.getConversationType().getValue());
        PublicServiceMenu menu = item.getMenu();
        if (menu != null) {
            map.putArray("menu", menuItemsToArray(menu.getMenuItems()));
        }
        return map;
    }

    private ResultCallback<PublicServiceProfileList> createPublicServiceProfileListCallback(final Promise promise) {
        return new ResultCallback<PublicServiceProfileList>() {
            @Override
            public void onSuccess(PublicServiceProfileList result) {
                WritableArray array = Arguments.createArray();
                for (PublicServiceProfile item : result.getPublicServiceData()) {
                    array.pushMap(publicServiceProfileToMap(item));
                }
                promise.resolve(array);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    @ReactMethod
    public void searchPublicService(String keyword, int searchType, int publicServiceType, final Promise promise) {
        ResultCallback<PublicServiceProfileList> callback = createPublicServiceProfileListCallback(promise);
        SearchType type = searchType == SearchType.EXACT.getValue() ? SearchType.EXACT : SearchType.FUZZY;
        if (publicServiceType == 0) {
            RongIMClient.getInstance().searchPublicService(type, keyword, callback);
        } else {
            RongIMClient.getInstance().searchPublicServiceByType(
                PublicServiceType.setValue(publicServiceType), type, keyword, callback);
        }
    }

    @ReactMethod
    public void subscribePublicService(int type, String id, final Promise promise) {
        RongIMClient.getInstance().subscribePublicService(
            PublicServiceType.setValue(type), id, createOperationCallback(promise));
    }

    @ReactMethod
    public void unsubscribePublicService(int type, String id, final Promise promise) {
        RongIMClient.getInstance().unsubscribePublicService(
            PublicServiceType.setValue(type), id, createOperationCallback(promise));
    }

    @ReactMethod
    public void getPublicServiceProfile(int type, String id, final Promise promise) {
        RongIMClient.getInstance().getPublicServiceProfile(
            PublicServiceType.setValue(type), id, new ResultCallback<PublicServiceProfile>() {
                @Override
                public void onSuccess(PublicServiceProfile profile) {
                    promise.resolve(publicServiceProfileToMap(profile));
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    @ReactMethod
    public void getPublicServiceList(final Promise promise) {
        RongIMClient.getInstance().getPublicServiceList(createPublicServiceProfileListCallback(promise));
    }

    @ReactMethod
    public void sendTypingStatus(int conversationType, String targetId, String typingStatus) {
        RongIMClient.getInstance().sendTypingStatus(ConversationType.setValue(conversationType), targetId, typingStatus);
    }

    @ReactMethod
    public void sendReadReceiptMessage(int conversationType, String targetId, double timestamp) {
        RongIMClient.getInstance().sendReadReceiptMessage(ConversationType.setValue(conversationType), targetId, (long) timestamp);
    }

    @ReactMethod
    public void sendReadReceiptRequest(int messageId, final Promise promise) {
        RongIMClient.getInstance().getMessage(messageId, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().sendReadReceiptRequest(message, createOperationCallback(promise));
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void cleanRemoteHistoryMessages(int conversationType, String targetId, double timestamp, Promise promise) {
        RongIMClient.getInstance().cleanRemoteHistoryMessages(
            ConversationType.setValue(conversationType), targetId, (long) timestamp, createOperationCallback(promise));
    }

    @ReactMethod
    public void setReconnectKickEnable(boolean enabled) {
        RongIMClient.getInstance().setReconnectKickEnable(enabled);
    }

    @ReactMethod
    public void setStatisticServer(String server) {
        RongIMClient.setStatisticDomain(server);
    }

    @ReactMethod
    public void syncConversationReadStatus(int conversationType, String targetId, double timestamp, Promise promise) {
        RongIMClient.getInstance().syncConversationReadStatus(
            ConversationType.setValue(conversationType), targetId, (long) timestamp, createOperationCallback(promise));
    }

    @ReactMethod
    public void cancelSendMediaMessage(int messageId, final Promise promise) {
        RongIMClient.getInstance().getMessage(messageId, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().cancelSendMediaMessage(message, createOperationCallback(promise));
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void cancelDownloadMediaMessage(int messageId, final Promise promise) {
        RongIMClient.getInstance().getMessage(messageId, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().cancelDownloadMediaMessage(message, createOperationCallback(promise));
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void downloadMediaMessage(int messageId, final String eventId, final Promise promise) {
        RongIMClient.getInstance().getMessage(messageId, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().downloadMediaMessage(message, new IDownloadMediaMessageCallback() {
                    @Override
                    public void onSuccess(Message message) {
                        MediaMessageContent media = (MediaMessageContent) message.getContent();
                        WritableMap map = createEventMap(eventId, "success");
                        map.putString("path", media.getLocalPath().toString());
                        eventEmitter.emit("rcimlib-download-media-message", map);
                    }

                    @Override
                    public void onProgress(Message message, int i) {
                        WritableMap map = createEventMap(eventId, "progress");
                        map.putInt("progress", i);
                        eventEmitter.emit("rcimlib-download-media-message", map);
                    }

                    @Override
                    public void onError(Message message, ErrorCode errorCode) {
                        WritableMap map = createEventMap(eventId, "error");
                        map.putInt("errorCode", errorCode.getValue());
                        eventEmitter.emit("rcimlib-download-media-message", map);
                    }

                    @Override
                    public void onCanceled(Message message) {
                        eventEmitter.emit("rcimlib-download-media-message", createEventMap(eventId, "cancel"));
                    }
                });
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void getMessage(int messageId, final Promise promise) {
        RongIMClient.getInstance().getMessage(messageId, createMessageCallback(promise));
    }

    @ReactMethod
    public void getMessageByUId(String UId, final Promise promise) {
        RongIMClient.getInstance().getMessageByUid(UId, createMessageCallback(promise));
    }

    @ReactMethod
    public void setMessageExtra(int messageId, String extra, final Promise promise) {
        RongIMClient.getInstance().setMessageExtra(messageId, extra, createBooleanCallback(promise));
    }

    @ReactMethod
    public void getMessageSendTime(int messageId, final Promise promise) {
        promise.resolve(RongIMClient.getInstance().getSendTimeByMessageId(messageId));
    }

    @ReactMethod
    public void getFirstUnreadMessage(int conversationType, String targetId, Promise promise) {
        RongIMClient.getInstance().getTheFirstUnreadMessage(
            ConversationType.setValue(conversationType), targetId, createMessageCallback(promise));
    }

    @ReactMethod
    public void getUnreadMentionedMessages(int conversationType, String targetId, Promise promise) {
        RongIMClient.getInstance().getUnreadMentionedMessages(
            ConversationType.setValue(conversationType), targetId, createMessagesCallback(promise));
    }

    @ReactMethod
    public void setConversationToTop(int conversationType, String targetId, Boolean isTop, Promise promise) {
        RongIMClient.getInstance().setConversationToTop(
            ConversationType.setValue(conversationType), targetId, isTop, createBooleanCallback(promise));
    }

    @ReactMethod
    public void clearTextMessageDraft(int conversationType, String targetId, Promise promise) {
        RongIMClient.getInstance().clearTextMessageDraft(
            ConversationType.setValue(conversationType), targetId, createBooleanCallback(promise));
    }

    @ReactMethod
    public void getRemoteChatRoomHistoryMessages(String targetId, double recordTime, int count, int order, final Promise promise) {
        TimestampOrder timestampOrder = order == 0 ? TimestampOrder.RC_TIMESTAMP_DESC : TimestampOrder.RC_TIMESTAMP_ASC;
        RongIMClient.getInstance().getChatroomHistoryMessages(
            targetId, (long) recordTime, count, timestampOrder, new IChatRoomHistoryMessageCallback() {
                @Override
                public void onSuccess(List<Message> list, long syncTime) {
                    WritableMap map = Arguments.createMap();
                    map.putArray("messages", (WritableArray) messagesToArray(list));
                    map.putDouble("syncTime", syncTime);
                    promise.resolve(map);
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    @ReactMethod
    public void getRealTimeLocation(int conversationType, String targetId, Promise promise) {
        RealTimeLocationErrorCode code = RongIMClient.getInstance().getRealTimeLocation(
            ConversationType.setValue(conversationType), targetId);
        promise.resolve(code.getValue());
    }

    @ReactMethod
    public void startRealTimeLocation(int conversationType, String targetId, Promise promise) {
        RealTimeLocationErrorCode code = RongIMClient.getInstance().startRealTimeLocation(
            ConversationType.setValue(conversationType), targetId);
        promise.resolve(code.getValue());
    }

    @ReactMethod
    public void joinRealTimeLocation(int conversationType, String targetId, Promise promise) {
        RealTimeLocationErrorCode code = RongIMClient.getInstance().joinRealTimeLocation(
            ConversationType.setValue(conversationType), targetId);
        promise.resolve(code.getValue());
    }

    @ReactMethod
    public void quitRealTimeLocation(int conversationType, String targetId, Promise promise) {
        try {
            RongIMClient.getInstance().quitRealTimeLocation(
                ConversationType.setValue(conversationType), targetId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getRealTimeLocationParticipants(int conversationType, String targetId, Promise promise) {
        List<String> list = RongIMClient.getInstance().getRealTimeLocationParticipants(
            ConversationType.setValue(conversationType), targetId);
        WritableArray array = Arguments.createArray();
        if (list != null) {
            for (String item : list) {
                array.pushString(item);
            }
        }
        promise.resolve(array);
    }

    @ReactMethod
    public void getRealTimeLocationStatus(int conversationType, String targetId, Promise promise) {
        RealTimeLocationStatus status = RongIMClient.getInstance().getRealTimeLocationCurrentState(
            ConversationType.setValue(conversationType), targetId);
        promise.resolve(status.getValue());
    }

    @ReactMethod
    public void cleanHistoryMessages(int conversationType, String targetId, double timestamp, boolean clearRemote, Promise promise) {
        RongIMClient.getInstance().cleanHistoryMessages(
            ConversationType.setValue(conversationType), targetId, (long) timestamp, clearRemote, createOperationCallback(promise));
    }

    @ReactMethod
    public void getConnectionStatus(Promise promise) {
        promise.resolve(RongIMClient.getInstance().getCurrentConnectionStatus().getValue());
    }

    @ReactMethod
    public void sendReadReceiptResponse(int conversationType, String targetId, ReadableArray messages, Promise promise) {
        ArrayList<Message> list = new ArrayList<>();
        for (int i = 0; i < messages.size(); i += 1) {
            ReadableMap map = messages.getMap(i);
            if (map != null) {
                list.add(mapToMessage(map));
            }
        }
        RongIMClient.getInstance().sendReadReceiptResponse(
            ConversationType.setValue(conversationType), targetId, list, createOperationCallback(promise));
    }

    @ReactMethod
    public void setMessageSentStatus(int messageId, int status, final Promise promise) {
        RongIMClient.getInstance().getMessage(messageId, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().setMessageSentStatus(message, createBooleanCallback(promise));
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void getNotificationQuietHours(String startTime, int spanMinutes, Promise promise) {
        RongIMClient.getInstance().setNotificationQuietHours(startTime, spanMinutes, createOperationCallback(promise));
    }

    @ReactMethod
    public void getNotificationQuietHours(final Promise promise) {
        RongIMClient.getInstance().getNotificationQuietHours(new GetNotificationQuietHoursCallback() {
            @Override
            public void onSuccess(String startTime, int spanMinutes) {
                WritableMap map = Arguments.createMap();
                map.putString("startTime", startTime);
                map.putInt("spanMinutes", spanMinutes);
                promise.resolve(map);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void removeNotificationQuietHours(Promise promise) {
        RongIMClient.getInstance().removeNotificationQuietHours(createOperationCallback(promise));
    }

    @ReactMethod
    public void getOfflineMessageDuration(final Promise promise) {
        RongIMClient.getInstance().getOfflineMessageDuration(new ResultCallback<String>() {
            @Override
            public void onSuccess(String s) {
                promise.resolve(s);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    @ReactMethod
    public void setOfflineMessageDuration(int duration, final Promise promise) {
        RongIMClient.getInstance().setOfflineMessageDuration(duration, new ResultCallback<Long>() {
            @Override
            public void onSuccess(Long n) {
                promise.resolve(n);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        });
    }

    private CSCustomServiceInfo mapToCSCustomServiceInfo(ReadableMap map) {
        CSCustomServiceInfo.Builder builder = new CSCustomServiceInfo.Builder();
        if (map.hasKey("userId")) {
            builder.userId(map.getString("userId"));
        }
        if (map.hasKey("nickName")) {
            builder.nickName(map.getString("nickName"));
        }
        if (map.hasKey("loginName")) {
            builder.loginName(map.getString("loginName"));
        }
        if (map.hasKey("name")) {
            builder.name(map.getString("name"));
        }
        if (map.hasKey("grade")) {
            builder.grade(map.getString("grade"));
        }
        if (map.hasKey("age")) {
            builder.age(map.getString("age"));
        }
        if (map.hasKey("profession")) {
            builder.profession(map.getString("profession"));
        }
        if (map.hasKey("portraitUrl")) {
            builder.portraitUrl(map.getString("portraitUrl"));
        }
        if (map.hasKey("province")) {
            builder.province(map.getString("province"));
        }
        if (map.hasKey("city")) {
            builder.city(map.getString("city"));
        }
        if (map.hasKey("memo")) {
            builder.memo(map.getString("memo"));
        }
        if (map.hasKey("mobileNo")) {
            builder.mobileNo(map.getString("mobileNo"));
        }
        if (map.hasKey("email")) {
            builder.email(map.getString("email"));
        }
        if (map.hasKey("address")) {
            builder.address(map.getString("address"));
        }
        if (map.hasKey("QQ")) {
            builder.QQ(map.getString("QQ"));
        }
        if (map.hasKey("weibo")) {
            builder.weibo(map.getString("weibo"));
        }
        if (map.hasKey("weixin")) {
            builder.weixin(map.getString("weixin"));
        }
        if (map.hasKey("page")) {
            builder.page(map.getString("page"));
        }
        if (map.hasKey("referrer")) {
            builder.referrer(map.getString("referrer"));
        }
        if (map.hasKey("enterUrl")) {
            builder.enterUrl(map.getString("enterUrl"));
        }
        if (map.hasKey("skillId")) {
            builder.skillId(map.getString("skillId"));
        }
        if (map.hasKey("listUrl")) {
            ReadableArray array = map.getArray("listUrl");
            assert array != null;
            ArrayList<String> listUrl = arrayToStringList(array);
            builder.listUrl(listUrl);
        }
        if (map.hasKey("define")) {
            builder.define(map.getString("define"));
        }
        if (map.hasKey("productId")) {
            builder.productId(map.getString("productId"));
        }
        return builder.build();
    }

    private ArrayList<String> arrayToStringList(ReadableArray array) {
        ArrayList<String> list = new ArrayList<>(array.size());
        for (int i = 0; i < array.size(); i += 1) {
            list.set(i, array.getString(i));
        }
        return list;
    }

    private WritableMap CSLMessageItemToMap(CSLMessageItem item) {
        WritableMap map = Arguments.createMap();
        map.putString("name", item.getName());
        map.putString("title", item.getTitle());
        map.putString("defaultText", item.getDefaultText());
        map.putString("type", item.getType());
        map.putString("verification", item.getVerification());
        map.putBoolean("required", item.isRequired());
        map.putInt("max", item.getMax());
        return map;
    }

    private WritableMap customServiceConfigToMap(CustomServiceConfig config) {
        WritableMap map = Arguments.createMap();
        map.putBoolean("isBlack", config.isBlack);
        map.putString("companyName", config.companyName);
        map.putString("companyIcon", config.companyIcon);
        map.putString("announceClickUrl", config.announceClickUrl);
        map.putString("announceMsg", config.announceMsg);
        WritableArray leaveMessageNativeInfo = Arguments.createArray();
        for (CSLMessageItem item : config.leaveMessageNativeInfo) {
            leaveMessageNativeInfo.pushMap(CSLMessageItemToMap(item));
        }
        map.putArray("leaveMessageNativeInfo", leaveMessageNativeInfo);
        map.putInt("leaveMessageType", config.leaveMessageConfigType.getValue());
        map.putInt("userTipTime", config.userTipTime);
        map.putString("userTipWord", config.userTipWord);
        map.putInt("adminTipTime", config.adminTipTime);
        map.putString("adminTipWord", config.adminTipWord);
        map.putInt("evaEntryPoint", config.evaEntryPoint.getValue());
        map.putInt("evaType", config.evaluateType.getValue());
        map.putBoolean("robotSessionNoEva", config.robotSessionNoEva);
        WritableArray humanEvaluateItems = Arguments.createArray();
        for (CSHumanEvaluateItem item : config.humanEvaluateList) {
            WritableMap evaItem = Arguments.createMap();
            evaItem.putInt("value", item.getValue());
            evaItem.putString("description", item.getDescription());
            humanEvaluateItems.pushMap(evaItem);
        }
        map.putArray("humanEvaluateItems", humanEvaluateItems);
        map.putBoolean("isReportResolveStatus", config.isReportResolveStatus);
        map.putBoolean("isDisableLocation", config.isDisableLocation);
        return map;
    }

    @ReactMethod
    public void startCustomerService(String kefuId, ReadableMap csInfo, final String eventId) {
        RongIMClient.getInstance().startCustomService(kefuId, new ICustomServiceListener() {
            @Override
            public void onSuccess(CustomServiceConfig customServiceConfig) {
                WritableMap map = createEventMap(eventId, "success");
                map.putMap("config", customServiceConfigToMap(customServiceConfig));
                eventEmitter.emit("rcimlib-customer-service", map);
            }

            @Override
            public void onError(int errorCode, String message) {
                WritableMap map = createEventMap(eventId, "error");
                map.putInt("errorCode", errorCode);
                map.putString("errorMessage", message);
                eventEmitter.emit("rcimlib-customer-service", map);
            }

            @Override
            public void onModeChanged(CustomServiceMode customServiceMode) {
                WritableMap map = createEventMap(eventId, "mode-changed");
                map.putInt("mode", customServiceMode.getValue());
                eventEmitter.emit("rcimlib-customer-service", map);
            }

            @Override
            public void onQuit(String message) {
                WritableMap map = createEventMap(eventId, "quit");
                map.putString("message", message);
                eventEmitter.emit("rcimlib-customer-service", map);
            }

            @Override
            public void onPullEvaluation(String dialogId) {
                WritableMap map = createEventMap(eventId, "pull-evaluation");
                map.putString("dialogId", dialogId);
                eventEmitter.emit("rcimlib-customer-service", map);
            }

            @Override
            public void onSelectGroup(List<CSGroupItem> list) {
                WritableMap map = createEventMap(eventId, "select-group");
                WritableArray groups = Arguments.createArray();
                for (CSGroupItem item : list) {
                    WritableMap group = Arguments.createMap();
                    group.putString("id", item.getId());
                    group.putString("name", item.getName());
                    group.putBoolean("isOnline", item.getOnline());
                }
                map.putArray("groups", groups);
                eventEmitter.emit("rcimlib-customer-service", map);
            }
        }, mapToCSCustomServiceInfo(csInfo));
    }

    @ReactMethod
    public void switchToHumanMode(String kefuId) {
        RongIMClient.getInstance().switchToHumanMode(kefuId);
    }

    @ReactMethod
    public void selectCustomerServiceGroup(String kefuId, String groupId) {
        RongIMClient.getInstance().selectCustomServiceGroup(kefuId, groupId);
    }

    @ReactMethod
    public void stopCustomerService(String kefuId, String groupId) {
        RongIMClient.getInstance().stopCustomService(kefuId);
    }

    @ReactMethod
    public void leaveMessageCustomerService(String kefuId, ReadableMap message, Promise promise) {
        HashMap<String, Object> contentMap = message.toHashMap();
        HashMap<String, String> map = new HashMap<>();
        for (String key : message.toHashMap().keySet()) {
            map.put(key, (String) contentMap.get(key));
        }
        RongIMClient.getInstance().leaveMessageCustomService(kefuId, map, createOperationCallback(promise));
    }

    @ReactMethod
    public void evaluateCustomerService(
        String kefuId, String dialogId, int value, String suggest, int status, String tagText, String extra) {
        if (tagText == null) {
            RongIMClient.getInstance().evaluateCustomService(
                kefuId, value, CSEvaSolveStatus.valueOf(status), suggest, dialogId);
        } else {
            RongIMClient.getInstance().evaluateCustomService(
                kefuId, value, CSEvaSolveStatus.valueOf(status), tagText, suggest, dialogId, extra);
        }
    }
}
