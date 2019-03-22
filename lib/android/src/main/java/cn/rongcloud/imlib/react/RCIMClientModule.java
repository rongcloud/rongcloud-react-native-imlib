package cn.rongcloud.imlib.react;

import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import io.rong.imlib.IRongCallback.ISendMessageCallback;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.RongIMClient.ConnectionStatusListener;
import io.rong.imlib.RongIMClient.OnReceiveMessageListener;
import io.rong.imlib.RongIMClient.ResultCallback;
import io.rong.imlib.model.Conversation.ConversationType;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.Message.SentStatus;
import io.rong.imlib.model.MessageContent;
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

        if (messageContent != null) {
            RongIMClient.getInstance().sendMessage(message, pushContent, pushData, new ISendMessageCallback() {
                @Override
                public void onAttached(Message message) {
                }

                @Override
                public void onSuccess(Message message) {
                    WritableMap map = createEventMap(eventId, "success");
                    map.putMap("message", messageToMap(message));
                    eventEmitter.emit("rcimlib-send-message", map);
                }

                @Override
                public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                    WritableMap map = createEventMap(eventId, "error");
                    map.putInt("errorCode", errorCode.getValue());
                    map.putMap("message", messageToMap(message));
                    eventEmitter.emit("rcimlib-send-message", map);
                }
            });
        }
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
                    Uri uri = getFileUri(map.getString("local"));
                    messageContent = ImageMessage.obtain(uri, uri);
                    break;
                case "file":
                    messageContent = FileMessage.obtain(getFileUri(map.getString("local")));
                    break;
            }
        }
        return messageContent;
    }

    private Uri getFileUri(String s) {
        Uri uri = Uri.parse(s);
        if (s.startsWith("content://")) {
            String[] projection = {MediaStore.Files.FileColumns.DATA};
            Cursor cursor = reactContext.getContentResolver().query(uri, projection, null, null, null);
            if (cursor != null) {
                int index = cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DATA);
                cursor.moveToFirst();
                String path = cursor.getString(index);
                cursor.close();
                return Uri.parse("file://" + path);
            }
        }
        return uri;
    }

    @ReactMethod
    public void getHistoryMessages(int type, String targetId, String objectName, int oldestMessageId, int count, final Promise promise) {
        ResultCallback<List<Message>> callback = new ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> messages) {
                WritableArray array = Arguments.createArray();
                if (messages != null) {
                    for (Message message : messages) {
                        array.pushMap(messageToMap(message));
                    }
                }
                promise.resolve(array);
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                promise.reject(errorCode + "", "");
            }
        };
        ConversationType conversationType = ConversationType.setValue(type);
        if (objectName.isEmpty()) {
            RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, oldestMessageId, count, callback);
        } else {
            RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, objectName, oldestMessageId, count, callback);
        }
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
}
