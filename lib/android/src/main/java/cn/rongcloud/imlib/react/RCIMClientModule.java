package cn.rongcloud.imlib.react;

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
import io.rong.message.MediaMessageContent;
import io.rong.message.RecallNotificationMessage;

import javax.annotation.Nonnull;
import java.util.*;

import static cn.rongcloud.imlib.react.Convert.*;
import static cn.rongcloud.imlib.react.Utils.*;

@SuppressWarnings("unused")
public class RCIMClientModule extends ReactContextBaseJavaModule {
    private RCTDeviceEventEmitter eventEmitter;
    private ReactApplicationContext reactContext;

    RCIMClientModule(final ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        Convert.reactContext = reactContext;

        RongIMClient.setOnReceiveMessageListener(new OnReceiveMessageListener() {
            @Override
            public boolean onReceived(Message message, int left) {
                WritableMap map = Arguments.createMap();
                map.putMap("message", toJSON(message));
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
                eventEmitter.emit("rcimlib-read-receipt-received", toJSON(message));
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
        RCPushReceiver.eventEmitter = eventEmitter;
        RongIMClient.init(reactContext, key);
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

    @ReactMethod
    public void sendMessage(ReadableMap data, final String eventId) {
        try {
            Message message = toMessage(data);
            String pushContent = getStringFromMap(data, "pushContent");
            String pushData = getStringFromMap(data, "pushData");
            RongIMClient.getInstance().sendMessage(message, pushContent, pushData, createSendMessageCallback(eventId));
        } catch (Exception e) {
            e.printStackTrace();
            onSendMessageError(eventId, null, ErrorCode.PARAMETER_ERROR, e.getMessage());
        }
    }

    @ReactMethod
    public void sendMediaMessage(ReadableMap data, final String eventId) {
        try {
            Message message = toMessage(data);
            String pushContent = getStringFromMap(data, "pushContent");
            String pushData = getStringFromMap(data, "pushData");
            RongIMClient.getInstance().sendMediaMessage(message, pushContent, pushData, createSendMessageCallback(eventId));
        } catch (Exception e) {
            e.printStackTrace();
            onSendMessageError(eventId, null, ErrorCode.PARAMETER_ERROR, e.getMessage());
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
            public void onError(Message message, ErrorCode errorCode) {
                onSendMessageError(eventId, message, errorCode, errorCode.getMessage());
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

    @ReactMethod
    public void sendDirectionalMessage(ReadableMap data, ReadableArray users, final String eventId) {
        try {
            ConversationType conversationType = ConversationType.setValue(data.getInt("conversationType"));
            MessageContent messageContent = toMessageContent(data.getMap("content"));
            String targetId = data.getString("targetId");
            String pushContent = getStringFromMap(data, "pushContent");
            String pushData = getStringFromMap(data, "pushData");
            String[] array = toStringArray(users);
            RongIMClient.getInstance().sendDirectionalMessage(
                    conversationType, targetId, messageContent, array, pushContent, pushData, createSendMessageCallback(eventId));
        } catch (Exception e) {
            e.printStackTrace();
            onSendMessageError(eventId, null, ErrorCode.PARAMETER_ERROR, e.getMessage());
        }
    }

    private void onSendMessageError(String eventId, Message message, RongIMClient.ErrorCode errorCode, String errorMessage) {
        WritableMap map = createEventMap(eventId, "error");
        map.putInt("errorCode", errorCode.getValue());
        map.putString("errorMessage", errorMessage);
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

    @ReactMethod
    public void recallMessage(int id, final String pushContent, final Promise promise) {
        RongIMClient.getInstance().getMessage(id, new ResultCallback<Message>() {
            @Override
            public void onSuccess(Message message) {
                RongIMClient.getInstance().recallMessage(message, pushContent, new ResultCallback<RecallNotificationMessage>() {
                    @Override
                    public void onSuccess(RecallNotificationMessage message) {
                        promise.resolve(toJSON("RC:RcNtf", message));
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
            ArrayList<String> names = Convert.toStringList(objectNames);
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

    @ReactMethod
    public void insertOutgoingMessage(int type, String targetId, int status, ReadableMap content, int sentTime, final Promise promise) {
        MessageContent messageContent = toMessageContent(content);
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
        MessageContent messageContent = toMessageContent(content);
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
                array[i] = toMessage(message);
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

    @ReactMethod
    public void searchConversations(String keyword, ReadableArray types, ReadableArray objectNames, final Promise promise) {
        ConversationType[] conversationTypes = toConversationTypeArray(types);
        String[] objectNamesArray = toStringArray(objectNames);
        RongIMClient.getInstance().searchConversations(
                keyword, conversationTypes, objectNamesArray, new ResultCallback<List<SearchConversationResult>>() {
                    @Override
                    public void onSuccess(List<SearchConversationResult> conversations) {
                        WritableArray result = Arguments.createArray();
                        for (SearchConversationResult item : conversations) {
                            WritableMap map = Arguments.createMap();
                            map.putMap("conversation", toJSON(item.getConversation()));
                            map.putInt("matchCount", item.getMatchCount());
                            result.pushMap(map);
                        }
                        promise.resolve(result);
                    }

                    @Override
                    public void onError(RongIMClient.ErrorCode errorCode) {
                        reject(promise, errorCode);
                    }
                });
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
                        promise.resolve(toJSON(conversation));
                    }

                    @Override
                    public void onError(ErrorCode errorCode) {
                        reject(promise, errorCode);
                    }
                });
    }

    @ReactMethod
    public void getConversationList(ReadableArray conversationTypes, int count, int timestamp, final Promise promise) {
        ConversationType[] types = toConversationTypeArray(conversationTypes);
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
        ConversationType[] types = toConversationTypeArray(conversationTypes);
        RongIMClient.getInstance().getBlockedConversationList(createConversationListCallback(promise), types);
    }

    @ReactMethod
    public void removeConversation(int conversationType, String targetId, final Promise promise) {
        RongIMClient.getInstance().removeConversation(
                ConversationType.setValue(conversationType), targetId, createBooleanCallback(promise));
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
            ConversationType[] types = toConversationTypeArray(conversationTypes);
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
        RongIMClient.getInstance().addMemberToDiscussion(
                targetId, toStringList(userList), createOperationCallback(promise));
    }

    @ReactMethod
    public void removeMemberFromDiscussion(String targetId, String userId, final Promise promise) {
        RongIMClient.getInstance().removeMemberFromDiscussion(targetId, userId, createOperationCallback(promise));
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
                        promise.resolve(toJSON(profile));
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
                        map.putArray("messages", toJSON(list));
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
                list.add(toMessage(map));
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
    public void setMessageReceivedStatus(int messageId, int status, final Promise promise) {
        RongIMClient.getInstance().setMessageReceivedStatus(messageId, new ReceivedStatus(status), createBooleanCallback(promise));
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

    @ReactMethod
    public void startCustomerService(String kefuId, ReadableMap csInfo, final String eventId) {
        RongIMClient.getInstance().startCustomService(kefuId, new ICustomServiceListener() {
            @Override
            public void onSuccess(CustomServiceConfig customServiceConfig) {
                WritableMap map = createEventMap(eventId, "success");
                map.putMap("config", toJSON(customServiceConfig));
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
        }, toCSCustomServiceInfo(csInfo));
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

    @ReactMethod
    public void getCurrentUserId(Promise promise) {
        promise.resolve(RongIMClient.getInstance().getCurrentUserId());
    }

    @ReactMethod
    public void setPushContentShowStatus(boolean status, Promise promise) {
        RongIMClient.getInstance().setPushContentShowStatus(status, createOperationCallback(promise));
    }

    @ReactMethod
    public void getPushContentShowStatus(Promise promise) {
        RongIMClient.getInstance().getPushContentShowStatus(createBooleanCallback(promise));
    }
}
