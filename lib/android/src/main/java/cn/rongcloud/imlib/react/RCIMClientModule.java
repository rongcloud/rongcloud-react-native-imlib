package cn.rongcloud.imlib.react;

import android.net.Uri;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import io.rong.imlib.IRongCallback.ISendMediaMessageCallback;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.RongIMClient.*;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Conversation.ConversationType;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.Message.SentStatus;
import io.rong.imlib.model.MessageContent;
import io.rong.imlib.model.SearchConversationResult;
import io.rong.message.FileMessage;
import io.rong.message.ImageMessage;
import io.rong.message.TextMessage;

import javax.annotation.Nonnull;
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
                promise.reject(errorCode + "", "");
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
                promise.reject(errorCode + "", "");
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
                        promise.reject(errorCode + "", "");
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
                promise.reject(errorCode + "", "");
            }
        };
    }

    @ReactMethod
    public void searchConversations(String keyword, ReadableArray conversationTypes, ReadableArray objectNames, final Promise promise) {
        ConversationType[] conversationTypesArray = new ConversationType[conversationTypes.size()];
        for (int i = 0; i < conversationTypes.size(); i += 1) {
            conversationTypesArray[i] = ConversationType.setValue(conversationTypes.getInt(i));
        }

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
                        promise.reject(errorCode + "", "");
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
        map.putString("senderUserId", conversation.getSenderUserId());
        return map;
    }

    @ReactMethod
    public void searchMessages(int conversationType, String targetId, String keyword, int count, double startTime, final Promise promise) {
        ResultCallback<List<Message>> callback = createMessagesCallback(promise);
        RongIMClient.getInstance().searchMessages(
                ConversationType.setValue(conversationType), targetId, keyword, count, (long) startTime, callback);
    }
}
