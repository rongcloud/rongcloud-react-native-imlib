package cn.rongcloud.imlib.react;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import io.rong.imlib.RongIMClient.ErrorCode;
import io.rong.imlib.RongIMClient.OperationCallback;
import io.rong.imlib.RongIMClient.ResultCallback;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Conversation.ConversationNotificationStatus;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.PublicServiceProfile;
import io.rong.imlib.model.PublicServiceProfileList;

import java.io.*;
import java.util.List;

import static cn.rongcloud.imlib.react.Convert.toJSON;

class Utils {
    private static String getPathFromUri(Context context, Uri uri, String fileName) {
        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            File file = createTemporalFile(context, inputStream, fileName);
            if (file != null) {
                return file.getPath();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private static File createTemporalFile(Context context, InputStream inputStream, String fileName) throws IOException {
        if (inputStream != null) {
            File target = new File(context.getCacheDir(), fileName);
            OutputStream outputStream = new FileOutputStream(target);
            try {
                byte[] buffer = new byte[1024];
                int read;
                while ((read = inputStream.read(buffer)) > 0) {
                    outputStream.write(buffer, 0, read);
                }
            } finally {
                outputStream.close();
                inputStream.close();
            }
            return target;
        }
        return null;
    }

    static Uri getFileUri(Context context, String s) {
        Uri uri = Uri.parse(s);
        if (s.startsWith("content://")) {
            // 如果 uri 里存在完整的路径，则提取出来直接使用
            String storageDirectory = Environment.getExternalStorageDirectory().toString();
            int index = s.indexOf(storageDirectory);
            if (index != -1) {
                String path = s.substring(index);
                return Uri.parse("file://" + path);
            }

            String[] types = {MediaStore.MediaColumns.DATA, MediaStore.MediaColumns.DISPLAY_NAME};
            Cursor cursor = context.getContentResolver().query(uri, types, null, null, null);
            if (cursor != null) {
                cursor.moveToFirst();
                int pathIndex = cursor.getColumnIndex(types[0]);
                String path = null;
                if (pathIndex != -1) {
                    path = cursor.getString(pathIndex);
                }
                int fileNameIndex = cursor.getColumnIndex(types[1]);
                String filename = cursor.getString(fileNameIndex);
                cursor.close();
                if (path == null) {
                    path = Utils.getPathFromUri(context, uri, filename);
                }
                return Uri.parse("file://" + path);
            }
        }
        return uri;
    }

    static void reject(Promise promise, ErrorCode errorcode) {
        promise.reject(errorcode.getValue() + "", errorcode.getMessage());
    }

    static ResultCallback<PublicServiceProfileList> createPublicServiceProfileListCallback(final Promise promise) {
        return new ResultCallback<PublicServiceProfileList>() {
            @Override
            public void onSuccess(PublicServiceProfileList result) {
                WritableArray array = Arguments.createArray();
                for (PublicServiceProfile item : result.getPublicServiceData()) {
                    array.pushMap(toJSON(item));
                }
                promise.resolve(array);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    static OperationCallback createOperationCallback(final Promise promise) {
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

    static ResultCallback<ConversationNotificationStatus> createConversationNotificationStatusCallback(final Promise promise) {
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

    static ResultCallback<List<Conversation>> createConversationListCallback(final Promise promise) {
        return new ResultCallback<List<Conversation>>() {
            @Override
            public void onSuccess(List<Conversation> conversations) {
                WritableArray array = Arguments.createArray();
                if (conversations != null) {
                    for (Conversation conversation : conversations) {
                        array.pushMap(toJSON(conversation));
                    }
                }
                promise.resolve(array);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    static WritableMap createEventMap(String eventId, String type) {
        WritableMap map = Arguments.createMap();
        map.putString("eventId", eventId);
        map.putString("type", type);
        return map;
    }

    static ResultCallback<List<Message>> createMessagesCallback(final Promise promise) {
        return new ResultCallback<List<Message>>() {
            @Override
            public void onSuccess(List<Message> messages) {
                promise.resolve(toJSON(messages));
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    static ResultCallback<Message> createMessageCallback(final Promise promise) {
        return new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                if (message == null) {
                    promise.reject("", "获取消息失败");
                } else {
                    promise.resolve(toJSON(message));
                }
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }

    static ResultCallback<Boolean> createBooleanCallback(final Promise promise) {
        return new ResultCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                promise.resolve(result);
            }

            @Override
            public void onError(ErrorCode errorCode) {
                reject(promise, errorCode);
            }
        };
    }
}

