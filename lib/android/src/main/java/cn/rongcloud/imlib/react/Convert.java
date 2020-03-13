package cn.rongcloud.imlib.react;

import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;

import io.rong.imlib.CustomServiceConfig;
import io.rong.imlib.model.CSCustomServiceInfo;
import io.rong.imlib.model.CSLMessageItem;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Conversation.ConversationType;
import io.rong.imlib.model.MentionedInfo;
import io.rong.imlib.model.MentionedInfo.MentionedType;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.MessageContent;
import io.rong.imlib.model.PublicServiceMenu;
import io.rong.imlib.model.PublicServiceMenuItem;
import io.rong.imlib.model.PublicServiceProfile;
import io.rong.imlib.model.UserInfo;
import io.rong.imlib.typingmessage.TypingStatusMessage;
import io.rong.message.CSHumanEvaluateItem;
import io.rong.message.CommandMessage;
import io.rong.message.CommandNotificationMessage;
import io.rong.message.ContactNotificationMessage;
import io.rong.message.FileMessage;
import io.rong.message.GIFMessage;
import io.rong.message.GroupNotificationMessage;
import io.rong.message.HQVoiceMessage;
import io.rong.message.ImageMessage;
import io.rong.message.InformationNotificationMessage;
import io.rong.message.LocationMessage;
import io.rong.message.ProfileNotificationMessage;
import io.rong.message.PublicServiceCommandMessage;
import io.rong.message.ReadReceiptMessage;
import io.rong.message.RecallNotificationMessage;
import io.rong.message.TextMessage;
import io.rong.message.VoiceMessage;
import io.rong.push.PushType;
import io.rong.push.notification.PushNotificationMessage;

class Convert {
    static ReactApplicationContext reactContext;

    static WritableMap toJSON(PushNotificationMessage message, PushType pushType) {
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

    /**
     * @noinspection Duplicates
     */
    static WritableMap toJSON(String objectName, MessageContent content) {
        WritableMap map = Arguments.createMap();
        map.putString("objectName", objectName);
        switch (objectName) {
            case "RC:TxtMsg":
                TextMessage text = (TextMessage) content;
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
            case "RC:CmdNtf": {
                CommandNotificationMessage message = (CommandNotificationMessage) content;
                map.putString("data", message.getData());
                map.putString("name", message.getName());
                break;
            }
            case "RC:CmdMsg": {
                CommandMessage message = (CommandMessage) content;
                map.putString("data", message.getData());
                map.putString("name", message.getName());
                break;
            }
            case "RC:ContactNtf": {
                ContactNotificationMessage message = (ContactNotificationMessage) content;
                map.putString("extra", message.getExtra());
                map.putString("message", message.getMessage());
                map.putString("operation", message.getOperation());
                map.putString("sourceUserId", message.getSourceUserId());
                map.putString("targetUserId", message.getTargetUserId());
                break;
            }
            case "RC:ProfileNtf": {
                ProfileNotificationMessage message = (ProfileNotificationMessage) content;
                map.putString("extra", message.getExtra());
                map.putString("data", message.getData());
                map.putString("operation", message.getOperation());
                break;
            }
            case "RC:InfoNtf": {
                InformationNotificationMessage message = (InformationNotificationMessage) content;
                map.putString("extra", message.getExtra());
                map.putString("message", message.getMessage());
                break;
            }
            case "RC:GrpNtf": {
                GroupNotificationMessage message = (GroupNotificationMessage) content;
                map.putString("extra", message.getExtra());
                map.putString("message", message.getMessage());
                map.putString("data", message.getData());
                map.putString("operation", message.getOperation());
                map.putString("operatorUserId", message.getOperatorUserId());
                break;
            }
            case "RC:ReadNtf": {
                ReadReceiptMessage message = (ReadReceiptMessage) content;
                map.putInt("type", message.getType().getValue());
                map.putString("messageUId", message.getMessageUId());
                map.putDouble("lastMessageSendTime", message.getLastMessageSendTime());
                break;
            }
            case "RC:PSCmd": {
                PublicServiceCommandMessage message = (PublicServiceCommandMessage) content;
                map.putString("extra", message.getExtra());
                break;
            }
            case "RC:TypSts": {
                TypingStatusMessage message = (TypingStatusMessage) content;
                map.putString("data", message.getData());
                map.putString("typingContentType", message.getTypingContentType());
                break;
            }
            case "RC:HQVCMsg": {
                HQVoiceMessage message = (HQVoiceMessage) content;
                String local = "";
                Uri localUri = message.getLocalPath();
                if (localUri != null) {
                    local = localUri.toString();
                }
                String remote = "";
                Uri remoteUri = message.getMediaUrl();
                if (remoteUri != null) {
                    remote = remoteUri.toString();
                }
                map.putString("local", local);
                map.putString("remote", remote);
                map.putInt("duration", message.getDuration());
                map.putString("extra", message.getExtra());
                break;
            }
            case "RC:GIFMsg": {
                GIFMessage message = (GIFMessage) content;
                String local = "";
                Uri localUri = message.getLocalPath();
                if (localUri != null) {
                    local = localUri.toString();
                }
                String remote = "";
                Uri remoteUri = message.getRemoteUri();
                if (remoteUri != null) {
                    remote = remoteUri.toString();
                }
                map.putString("local", local);
                map.putString("remote", remote);
                map.putDouble("gifDataSize", message.getGifDataSize());
                map.putInt("width", message.getWidth());
                map.putInt("height", message.getHeight());
                map.putString("extra", message.getExtra());
                break;
            }
        }
        return map;
    }

    static WritableMap toJSON(Message message) {
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
        map.putInt("receivedStatus", message.getReceivedStatus().getFlag());
        map.putString("extra", message.getExtra());
        map.putString("objectName", message.getObjectName());
        String objectName = message.getObjectName();
        map.putMap("content", Convert.toJSON(objectName, message.getContent()));
        return map;
    }

    static WritableMap toJSON(Conversation conversation) {
        if (conversation == null) {
            return null;
        }
        WritableMap map = Arguments.createMap();
        map.putInt("conversationType", conversation.getConversationType().getValue());
        map.putString("conversationTitle", conversation.getConversationTitle());
        map.putBoolean("isTop", conversation.isTop());
        map.putInt("unreadMessageCount", conversation.getUnreadMessageCount());
        map.putString("draft", conversation.getDraft());
        map.putString("targetId", conversation.getTargetId());
        map.putString("objectName", conversation.getObjectName());
        map.putInt("latestMessageId", conversation.getLatestMessageId());
        map.putMap("latestMessage", Convert.toJSON(conversation.getObjectName(), conversation.getLatestMessage()));
        map.putInt("receivedStatus", conversation.getReceivedStatus().getFlag());
        map.putDouble("receivedTime", conversation.getReceivedTime());
        map.putInt("sentStatus", conversation.getSentStatus().getValue());
        map.putDouble("sentTime", conversation.getSentTime());
        map.putString("senderUserId", conversation.getSenderUserId());
        map.putInt("mentionedCount", conversation.getMentionedCount());
        map.putBoolean("hasUnreadMentioned", conversation.getMentionedCount() > 0);
        return map;
    }

    static WritableArray toJSON(List<Message> messages) {
        WritableArray array = Arguments.createArray();
        if (messages != null) {
            for (Message message : messages) {
                array.pushMap(toJSON(message));
            }
        }
        return array;
    }

    private static WritableArray toArray(List<PublicServiceMenuItem> items) {
        WritableArray menu = Arguments.createArray();
        for (PublicServiceMenuItem menuItem : items) {
            WritableMap menuItemMap = Arguments.createMap();
            menuItemMap.putString("id", menuItem.getId());
            menuItemMap.putString("name", menuItem.getName());
            menuItemMap.putString("url", menuItem.getUrl());
            menuItemMap.putInt("type", menuItem.getType().getValue());
            List<PublicServiceMenuItem> subItems = menuItem.getSubMenuItems();
            if (subItems != null && subItems.size() > 0) {
                menuItemMap.putArray("submenu", toArray(subItems));
            }
        }
        return menu;
    }

    static WritableMap toJSON(PublicServiceProfile item) {
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
            map.putArray("menu", toArray(menu.getMenuItems()));
        }
        return map;
    }

    private static WritableMap toJSON(CSLMessageItem item) {
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

    static WritableMap toJSON(CustomServiceConfig config) {
        WritableMap map = Arguments.createMap();
        map.putBoolean("isBlack", config.isBlack);
        map.putString("companyName", config.companyName);
        map.putString("companyIcon", config.companyIcon);
        map.putString("announceClickUrl", config.announceClickUrl);
        map.putString("announceMsg", config.announceMsg);
        WritableArray leaveMessageNativeInfo = Arguments.createArray();
        for (CSLMessageItem item : config.leaveMessageNativeInfo) {
            leaveMessageNativeInfo.pushMap(toJSON(item));
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

    static String[] toStringArray(ReadableArray items) {
        String[] array = new String[items.size()];
        for (int i = 0; i < items.size(); i += 1) {
            array[i] = items.getString(i);
        }
        return array;
    }

    static ArrayList<String> toStringList(ReadableArray array) {
        if (array == null) {
            return null;
        }
        ArrayList<String> list = new ArrayList<>();
        for (int i = 0; i < array.size(); i += 1) {
            list.add(array.getString(i));
        }
        return list;
    }

    static ConversationType[] toConversationTypeArray(ReadableArray array) {
        ConversationType[] conversationTypesArray = new ConversationType[array.size()];
        for (int i = 0; i < array.size(); i += 1) {
            conversationTypesArray[i] = ConversationType.setValue(array.getInt(i));
        }
        return conversationTypesArray;
    }

    static Message toMessage(ReadableMap map) {
        ConversationType conversationType = ConversationType.setValue(map.getInt("conversationType"));
        MessageContent content = toMessageContent(map.getMap("content"));
        return Message.obtain(map.getString("targetId"), conversationType, content);
    }

    static MessageContent toMessageContent(ReadableMap map) {
        if (map == null) {
            return null;
        }
        String objectName = map.getString("objectName");
        MessageContent messageContent = null;
        if (objectName != null) {
            switch (objectName) {
                case "RC:TxtMsg":
                    messageContent = TextMessage.obtain(map.getString("content"));
                    if (map.hasKey("extra")) {
                        ((TextMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:ImgMsg":
                    Uri uri = Utils.getFileUri(reactContext, map.getString("local"));
                    messageContent = ImageMessage.obtain(uri, uri);
                    if (map.hasKey("isFull")) {
                        ((ImageMessage) messageContent).setIsFull(map.getBoolean("isFull"));
                    }
                    if (map.hasKey("extra")) {
                        ((ImageMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:FileMsg":
                    messageContent = FileMessage.obtain(Utils.getFileUri(reactContext, map.getString("local")));
                    if (map.hasKey("extra")) {
                        ((FileMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:LBSMsg":
                    Uri thumbnail = Utils.getFileUri(reactContext, map.getString("thumbnail"));
                    messageContent = LocationMessage.obtain(
                        map.getDouble("latitude"), map.getDouble("longitude"), map.getString("name"), thumbnail);
                    if (map.hasKey("extra")) {
                        ((LocationMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:VcMsg":
                    Uri voice = Utils.getFileUri(reactContext, map.getString("local"));
                    messageContent = VoiceMessage.obtain(voice, map.getInt("duration"));
                    if (map.hasKey("extra")) {
                        ((VoiceMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:CmdMsg":
                    messageContent = CommandMessage.obtain(map.getString("name"), map.getString("data"));
                    break;
                case "RC:CmdNtf":
                    messageContent = CommandNotificationMessage.obtain(map.getString("name"), map.getString("data"));
                    break;
                case "RC:ContactNtf":
                    messageContent = ContactNotificationMessage.obtain(
                        map.getString("operation"),
                        map.getString("sourceUserId"),
                        map.getString("targetUserId"),
                        map.getString("message"));
                    if (map.hasKey("extra")) {
                        ((ContactNotificationMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:InfoNtf":
                    messageContent = InformationNotificationMessage.obtain(map.getString("message"));
                    break;
                case "RC:GrpNtf":
                    messageContent = GroupNotificationMessage.obtain(
                        map.getString("operatorUserId"),
                        map.getString("operation"),
                        map.getString("data"),
                        map.getString("message"));
                    break;
                case "RC:ReadNtf":
                    messageContent = ReadReceiptMessage.obtain((long) map.getDouble("sentTime"));
                    break;
                case "RC:HQVCMsg":
                    messageContent = HQVoiceMessage.obtain(
                        Utils.getFileUri(reactContext, map.getString("local")), map.getInt("duration"));
                    if (map.hasKey("extra")) {
                        ((HQVoiceMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
                case "RC:GIFMsg":
                    messageContent = GIFMessage.obtain(Utils.getFileUri(reactContext, map.getString("local")));
                    if (map.hasKey("extra")) {
                        ((GIFMessage) messageContent).setExtra(map.getString("extra"));
                    }
                    break;
            }
        }

        if (messageContent != null && map.hasKey("userInfo")) {
            ReadableMap userInfoMap = map.getMap("userInfo");
            if (userInfoMap != null) {
                UserInfo userInfo = new UserInfo(
                    userInfoMap.getString("userId"),
                    userInfoMap.getString("name"),
                    Uri.parse(userInfoMap.getString("portraitUrl")));
                messageContent.setUserInfo(userInfo);
            }
        }

        if (messageContent != null && map.hasKey("mentionedInfo")) {
            ReadableMap mentionedMap = map.getMap("mentionedInfo");
            if (mentionedMap != null) {
                MentionedType type = MentionedType.valueOf(mentionedMap.getInt("type"));
                ArrayList<String> userIdList = toStringList(mentionedMap.getArray("userIdList"));
                String content = mentionedMap.hasKey("mentionedContent") ?
                    mentionedMap.getString("mentionedContent") : null;
                MentionedInfo mentionedInfo = new MentionedInfo(type, userIdList, content);
                messageContent.setMentionedInfo(mentionedInfo);
            }
        }

        return messageContent;
    }

    static CSCustomServiceInfo toCSCustomServiceInfo(ReadableMap map) {
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
            ArrayList<String> listUrl = toStringList(array);
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
}
