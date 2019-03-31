package cn.rongcloud.imlib.react;

import android.net.Uri;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import io.rong.imlib.IRongCallback.ISendMediaMessageCallback;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.RongIMClient.*;
import io.rong.imlib.model.*;
import io.rong.imlib.model.ChatRoomInfo.ChatRoomMemberOrder;
import io.rong.imlib.model.Conversation.ConversationNotificationStatus;
import io.rong.imlib.model.Conversation.ConversationType;
import io.rong.imlib.model.Conversation.PublicServiceType;
import io.rong.imlib.model.Message.SentStatus;
import io.rong.message.*;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.List;

public class RCIMClientModule extends ReactContextBaseJavaModule {
    private RCTDeviceEventEmitter eventEmitter;
    private ReactApplicationContext reactContext;

    RCIMClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        RongIMClient.setOnReceiveMessageListener(new OnReceiveMessageListener() {
            @Override
            public boolean onReceived(Message message, int left) {
                eventEmitter.emit("rcimlib-receive-message", messageToMap(message));
                return false;
            }
        });
        RongIMClient.setConnectionStatusListener(new ConnectionStatusListener() {
            @Override
            public void onChanged(ConnectionStatus status) {
                eventEmitter.emit("rcimlib-connection-status", status.getValue());
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
                map.putString("name", location.getPoi());
                map.putString("thumbnail", location.getImgUri().toString());
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
    public void connect(Boolean isReceivePush) {
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

    @ReactMethod
    public void sendMessage(ReadableMap data, final String eventId) {
        ReadableMap content = data.getMap("content");
        if (content == null) {
            eventEmitter.emit("rcimlib-send-message", createEventMap(eventId, "error"));
            return;
        }
        MessageContent messageContent = mapToMessageContent(content);
        String targetId = data.getString("targetId");
        ConversationType conversationType = ConversationType.setValue(data.getInt("conversationType"));
        Message message = Message.obtain(targetId, conversationType, messageContent);

        String pushContent = "";
        if (data.hasKey("pushContent")) {
            pushContent = data.getString("pushContent");
        }

        String pushData = "";
        if (data.hasKey("pushData")) {
            pushData = data.getString("pushData");
        }

        ISendMediaMessageCallback callback = new ISendMediaMessageCallback() {
            @Override
            public void onAttached(Message message) {
            }

            @Override
            public void onCanceled(Message message) {
            }

            @Override
            public void onSuccess(Message message) {
                onSendMessageSuccess(eventId, message);
            }

            @Override
            public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                onSendMessageError(eventId, message, errorCode);
            }

            @Override
            public void onProgress(Message message, int i) {
                onSendMessageProgress(eventId, i);
            }
        };

        if (messageContent instanceof ImageMessage) {
            RongIMClient.getInstance().sendImageMessage(message, pushContent, pushData, new SendImageMessageCallback() {
                @Override
                public void onAttached(Message message) {
                }

                @Override
                public void onSuccess(Message message) {
                    onSendMessageSuccess(eventId, message);
                }

                @Override
                public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                    onSendMessageError(eventId, message, errorCode);
                }

                @Override
                public void onProgress(Message message, int i) {
                    onSendMessageProgress(eventId, i);
                }
            });
        } else if (messageContent instanceof FileMessage) {
            RongIMClient.getInstance().sendMediaMessage(message, pushContent, pushData, callback);
        } else {
            RongIMClient.getInstance().sendMessage(message, pushContent, pushData, callback);
        }
    }

    private void onSendMessageProgress(String eventId, int i) {
        WritableMap map = createEventMap(eventId, "progress");
        map.putInt("progress", i);
        eventEmitter.emit("rcimlib-send-message", map);
    }

    private void onSendMessageSuccess(String eventId, Message message) {
        WritableMap map = createEventMap(eventId, "success");
        map.putInt("messageId", message.getMessageId());
        eventEmitter.emit("rcimlib-send-message", map);
    }

    private void onSendMessageError(String eventId, Message message, RongIMClient.ErrorCode errorCode) {
        WritableMap map = createEventMap(eventId, "error");
        map.putInt("errorCode", errorCode.getValue());
        map.putInt("messageId", message.getMessageId());
        eventEmitter.emit("rcimlib-send-message", map);
    }

    private MessageContent mapToMessageContent(ReadableMap map) {
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
        ReadableMap content = map.getMap("content");
        if (content == null) {
            return null;
        }
        return Message.obtain(map.getString("targetId"), conversationType, mapToMessageContent(content));
    }

    @ReactMethod
    public void recallMessage(int id, final String pushContent, final Promise promise) {
        RongIMClient.getInstance().getMessage(id, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().recallMessage(message, pushContent, new ResultCallback<RecallNotificationMessage>() {
                    @Override
                    public void onSuccess(RecallNotificationMessage message) {
                        promise.resolve(null);
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
    public void getHistoryMessages(int type, String targetId, String objectName, int oldestMessageId, int count, final Promise promise) {
        ResultCallback<List<Message>> callback = createMessagesCallback(promise);
        ConversationType conversationType = ConversationType.setValue(type);
        if (objectName.isEmpty()) {
            RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, oldestMessageId, count, callback);
        } else {
            RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, objectName, oldestMessageId, count, callback);
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

    @ReactMethod
    public void insertOutgoingMessage(int type, String targetId, int status, ReadableMap content, int sentTime, final Promise promise) {
        MessageContent messageContent = mapToMessageContent(content);
        SentStatus sentStatus = SentStatus.setValue(status);
        ConversationType conversationType = ConversationType.setValue(type);
        ResultCallback<Message> callback = new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                promise.resolve(messageToMap(message));
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
        if (sentTime == 0) {
            RongIMClient.getInstance().insertOutgoingMessage(conversationType, targetId, sentStatus, messageContent, callback);
        } else {
            RongIMClient.getInstance().insertOutgoingMessage(conversationType, targetId, sentStatus, messageContent, sentTime, callback);
        }
    }

    @ReactMethod
    public void clearMessages(int type, String targetId, final Promise promise) {
        RongIMClient.getInstance().clearMessages(
            ConversationType.setValue(type), targetId, createDeleteMessagesCallback(promise));
    }

    @ReactMethod
    public void deleteMessages(int type, String targetId, final Promise promise) {
        RongIMClient.getInstance().deleteMessages(
            ConversationType.setValue(type), targetId, createDeleteMessagesCallback(promise));
    }

    @ReactMethod
    public void deleteMessagesByIds(ReadableArray ids, final Promise promise) {
        int[] array = new int[ids.size()];
        for (int i = 0; i < ids.size(); i += 1) {
            array[i] = ids.getInt(i);
        }
        RongIMClient.getInstance().deleteMessages(array, createDeleteMessagesCallback(promise));
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

    private ResultCallback<Boolean> createDeleteMessagesCallback(final Promise promise) {
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

    @ReactMethod
    public void searchConversations(String keyword, ReadableArray conversationTypes, ReadableArray objectNames, final Promise promise) {
        ConversationType[] conversationTypesArray = arrayToConversationTypes(conversationTypes);

        String[] objectNamesArray = new String[objectNames.size()];
        for (int i = 0; i < objectNames.size(); i += 1) {
            objectNamesArray[i] = objectNames.getString(i);
        }

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

    @ReactMethod
    public void getConversationList(ReadableArray conversationTypes, final Promise promise) {
        ConversationType[] types = arrayToConversationTypes(conversationTypes);
        ResultCallback<List<Conversation>> callback = new ResultCallback<List<Conversation>>() {
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
        if (types.length > 0) {
            RongIMClient.getInstance().getConversationList(callback, types);
        } else {
            RongIMClient.getInstance().getConversationList(callback);
        }
    }

    @ReactMethod
    public void removeConversation(int conversationType, String targetId, final Promise promise) {
        RongIMClient.getInstance().removeConversation(
            ConversationType.setValue(conversationType), targetId, new ResultCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean result) {
                    promise.resolve(result);
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    @ReactMethod
    public void setConversationNotificationStatus(int conversationType, String targetId, int status, final Promise promise) {
        RongIMClient.getInstance().setConversationNotificationStatus(
            ConversationType.setValue(conversationType),
            targetId,
            ConversationNotificationStatus.setValue(status),
            new ResultCallback<ConversationNotificationStatus>() {
                @Override
                public void onSuccess(ConversationNotificationStatus status) {
                    promise.resolve(status.getValue());
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    @ReactMethod
    public void getConversationNotificationStatus(int conversationType, String targetId, final Promise promise) {
        RongIMClient.getInstance().getConversationNotificationStatus(
            ConversationType.setValue(conversationType), targetId, new ResultCallback<ConversationNotificationStatus>() {
                @Override
                public void onSuccess(ConversationNotificationStatus status) {
                    promise.resolve(status.getValue());
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
    }

    @ReactMethod
    public void saveTextMessageDraft(int conversationType, String targetId, String content, final Promise promise) {
        RongIMClient.getInstance().saveTextMessageDraft(
            ConversationType.setValue(conversationType), targetId, content, new ResultCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean result) {
                    promise.resolve(result);
                }

                @Override
                public void onError(ErrorCode errorCode) {
                    reject(promise, errorCode);
                }
            });
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
                ConversationType.setValue(conversationType), targetId, new ResultCallback<Boolean>() {
                    @Override
                    public void onSuccess(Boolean result) {
                        promise.resolve(result);
                    }

                    @Override
                    public void onError(ErrorCode errorCode) {
                        reject(promise, errorCode);
                    }
                });
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
}
