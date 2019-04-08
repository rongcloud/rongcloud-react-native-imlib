package cn.rongcloud.imlib.react;

import android.content.Context;
import android.net.Uri;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import io.rong.push.PushType;
import io.rong.push.notification.PushMessageReceiver;
import io.rong.push.notification.PushNotificationMessage;

public class RCPushReceiver extends PushMessageReceiver {
    static RCTDeviceEventEmitter eventEmitter;

    private WritableMap messageToMap(PushNotificationMessage message, PushType pushType) {
        WritableMap map = Arguments.createMap();
        Uri portrait = message.getSenderPortrait();
        map.putString("pushType", pushType.getName());
        map.putString("pushId", message.getPushId());
        map.putString("pushTitle", message.getPushTitle());
        map.putString("pushFlag", message.getPushFlag());
        map.putString("pushContent", message.getPushContent());
        map.putString("pushData", message.getPushData());
        map.putString("objectName", message.getObjectName());
        map.putString("senderId", message.getSenderId());
        map.putString("senderName", message.getSenderName());
        map.putString("senderPortraitUrl", portrait == null ? "" : portrait.toString());
        map.putString("targetId", message.getTargetId());
        map.putString("targetUserName", message.getTargetUserName());
        map.putInt("conversationType", message.getConversationType().getValue());
        map.putString("extra", message.getExtra());
        return map;
    }

    @Override
    public boolean onNotificationMessageArrived(Context context, PushType pushType, PushNotificationMessage message) {
        if (eventEmitter != null) {
            eventEmitter.emit("rcimlib-push-arrived", messageToMap(message, pushType));
        }
        return false;
    }

    @Override
    public boolean onNotificationMessageClicked(Context context, PushType pushType, PushNotificationMessage message) {
        if (eventEmitter != null) {
            eventEmitter.emit("rcimlib-push-clicked", messageToMap(message, pushType));
        }
        return false;
    }
}
