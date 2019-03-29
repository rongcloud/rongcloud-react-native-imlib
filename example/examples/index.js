import * as React from "react";
import { ScrollView } from "react-native";
import Example from "./example";
import Connect from "./connect";
import ReceiveMessage from "./receive-message";
import SendMessage from "./send-message";
import GetHistoryMessages from "./get-history-messages";
import GetRemoteHistoryMessages from "./get-remote-history-messages";
import InsertMessage from "./insert-message";
import DeleteMessages from "./delete-messages";
import DeleteMessagesByIds from "./delete-messages-by-ids";
import SearchConversations from "./search-conversations";
import SearchMessages from "./search-messages";
import GetConversation from "./get-conversation";
import GetConversations from "./get-conversations";
import RemoveConversation from "./remove-conversation";
import ConversationNotificationStatus from "./conversation-notification-status";
import TextMessageDraft from "./text-message-draft";
import GetUnreadCount from "./get-unread-count";
import Blacklist from "./blacklist";
import ChatRoom from "./chat-room";

const examples = [
  Connect,
  ReceiveMessage,
  SendMessage,
  GetHistoryMessages,
  GetRemoteHistoryMessages,
  InsertMessage,
  DeleteMessages,
  DeleteMessagesByIds,
  SearchConversations,
  SearchMessages,
  GetConversation,
  GetConversations,
  RemoveConversation,
  ConversationNotificationStatus,
  TextMessageDraft,
  GetUnreadCount,
  Blacklist,
  ChatRoom
];

export default class extends React.PureComponent {
  static navigationOptions = { title: "RongCloud IMLib Examples" };

  render() {
    return (
      <ScrollView>
        {examples.map(({ navigationOptions: { title }, route }) => (
          <Example key={route} title={title} route={route} />
        ))}
      </ScrollView>
    );
  }
}

export {
  Connect,
  ReceiveMessage,
  SendMessage,
  GetHistoryMessages,
  GetRemoteHistoryMessages,
  InsertMessage,
  DeleteMessages,
  DeleteMessagesByIds,
  SearchConversations,
  SearchMessages,
  GetConversation,
  GetConversations,
  RemoveConversation,
  ConversationNotificationStatus,
  TextMessageDraft,
  GetUnreadCount,
  Blacklist,
  ChatRoom
};
