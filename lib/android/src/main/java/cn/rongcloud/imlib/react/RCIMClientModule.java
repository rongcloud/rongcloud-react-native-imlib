package cn.rongcloud.imlib.react;

import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import io.rong.imlib.IRongCallback.ISendMessageCallback;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.RongIMClient.ConnectionStatusListener;
import io.rong.imlib.RongIMClient.OnReceiveMessageListener;
import io.rong.imlib.RongIMClient.SendImageMessageCallback;
import io.rong.imlib.model.Conversation.ConversationType;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.MessageContent;
import io.rong.message.ImageMessage;
import io.rong.message.TextMessage;

public class RCIMClientModule extends ReactContextBaseJavaModule {
    private RCTDeviceEventEmitter eventEmitter;
    private ReactApplicationContext reactContext;

    RCIMClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        RongIMClient.setOnReceiveMessageListener(new OnReceiveMessageListener() {
            @Override
            public boolean onReceived(Message message, int left) {
                WritableMap map = Arguments.createMap();
                map.putInt("conversationType", message.getConversationType().getValue());
                map.putString("targetId", message.getTargetId());
                map.putString("messageUId", message.getUId());
                map.putInt("messageId", message.getMessageId());
                map.putInt("messageDirection", message.getMessageDirection().getValue());
                map.putString("senderUserId", message.getSenderUserId());
                map.putDouble("sentTime", (double) message.getSentTime());
                map.putDouble("receivedTime", (double) message.getReceivedTime());
                map.putString("content", new String(message.getContent().encode()));
                map.putString("extra", message.getExtra());
                String objectName = message.getObjectName();
                WritableMap content = Arguments.createMap();
                if (objectName.equals("RC:TxtMsg")) {
                    TextMessage text = (TextMessage) message.getContent();
                    content.putString("type", "text");
                    content.putString("content", text.getContent());
                    content.putString("extra", text.getExtra());
                } else if (objectName.equals("RC:ImgMsg")) {
                    content.putString("type", "image");
                }
                map.putMap("content", content);
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
    }

    @Override
    public String getName() {
        return "RCIMClient";
    }

    @ReactMethod
    public void init(String key) {
        eventEmitter = reactContext.getJSModule(RCTDeviceEventEmitter.class);
        RongIMClient.init(reactContext, key);
    }

    private WritableMap createEventMap(String eventId) {
        WritableMap map = Arguments.createMap();
        map.putString("eventId", eventId);
        return map;
    }

    @ReactMethod
    public void connect(String token, final String eventId) {
        RongIMClient.connect(token, new RongIMClient.ConnectCallback() {
            @Override
            public void onSuccess(String userId) {
                WritableMap map = createEventMap(eventId);
                map.putString("type", "success");
                map.putString("userId", userId);
                eventEmitter.emit("rcimlib-connect", map);
            }

            @Override
            public void onError(RongIMClient.ErrorCode error) {
                WritableMap map = createEventMap(eventId);
                map.putString("type", "error");
                map.putInt("errorCode", error.getValue());
                map.putString("errorMessage", error.getMessage());
                eventEmitter.emit("rcimlib-connect", map);
            }

            @Override
            public void onTokenIncorrect() {
                WritableMap map = createEventMap(eventId);
                map.putString("type", "tokenIncorrect");
                eventEmitter.emit("rcimlib-connect", map);
            }
        });
    }

    @ReactMethod
    public void sendMessage(int type, String targetId, ReadableMap content, String pushContent, String pushData, final Callback success, final Callback error) {
        String contentType = content.getString("type");
        MessageContent messageContent = null;
        if (contentType.equals("text")) {
            messageContent = TextMessage.obtain(content.getString("content"));
        }
        if (messageContent != null) {
            RongIMClient.getInstance().sendMessage(ConversationType.setValue(type), targetId, messageContent, pushContent, pushData, new ISendMessageCallback() {
                @Override
                public void onAttached(Message message) {
                }

                @Override
                public void onSuccess(Message message) {
                    success.invoke(message.getMessageId());
                }

                @Override
                public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                    error.invoke(errorCode.getValue(), message.getMessageId());
                }
            });
        }
    }

    private Uri getImageUri(String s) {
        Uri uri = Uri.parse(s);
        if (s.startsWith("content://")) {
            String[] projection = {MediaStore.Images.Media.DATA};
            Cursor cursor = reactContext.getContentResolver().query(uri, projection, null, null, null);
            if (cursor != null) {
                int index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                cursor.moveToFirst();
                String path = cursor.getString(index);
                cursor.close();
                return Uri.parse("file://" + path);
            }
        }
        return uri;
    }

    @ReactMethod
    public void sendImageMessage(int type, String targetId, ReadableMap content, String pushContent, String pushData, final Callback success, final Callback error) {
        Uri uri = getImageUri(content.getString("localUri"));
        ImageMessage imageMessage = ImageMessage.obtain(uri, uri);
        RongIMClient.getInstance().sendImageMessage(ConversationType.setValue(type), targetId, imageMessage, pushContent, pushData, new SendImageMessageCallback() {
            @Override
            public void onAttached(Message message) {
            }

            @Override
            public void onSuccess(Message message) {
                success.invoke(message.getMessageId());
            }

            @Override
            public void onProgress(Message message, int i) {
                Log.i("onProgress", i + "");
            }

            @Override
            public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                error.invoke(errorCode.getValue(), message.getMessageId());
            }
        });
    }
}
