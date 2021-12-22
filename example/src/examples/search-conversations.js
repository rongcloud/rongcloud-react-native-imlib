import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { searchConversations } from "@rongcloud/react-native-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "SearchConversations";
  static navigationOptions = { title: "搜索会话" };

  state = {
    conversationTypes: "1, 2",
    messageTypes: "RC:TxtMsg, RC:ImgMsg",
    keyword: "",
    conversations: []
  };

  setConversationTypes = conversationTypes => this.setState({ conversationTypes });
  setMessageTypes = messageTypes => this.setState({ messageTypes });
  setKeyword = keyword => this.setState({ keyword });

  searchConversations = async () => {
    const { conversationTypes, messageTypes, keyword } = this.state;
    if (!keyword) {
      return;
    }
    const conversations = await searchConversations(
      keyword,
      conversationTypes.split(",").map(i => parseInt(i)),
      messageTypes.split(",").map(i => i.trim())
    );
    this.setState({ conversations });
  };

  render() {
    const { conversationTypes, messageTypes, keyword, conversations } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="会话类型">
          <TextInput
            value={conversationTypes}
            onChangeText={this.setConversationTypes}
            placeholder="请输入会话类型，以逗号分隔"
          />
        </FormItem>
        <FormItem label="消息类型">
          <TextInput
            value={messageTypes}
            onChangeText={this.setMessageTypes}
            placeholder="请输入消息类型，以逗号分隔"
          />
        </FormItem>
        <FormItem label="关键字">
          <TextInput value={keyword} onChangeText={this.setKeyword} placeholder="请输入关键字" />
        </FormItem>
        <FormItem>
          <Button title="搜索会话" onPress={this.searchConversations} />
        </FormItem>
        {conversations.length === 0 && <Text style={style.item}>No messages.</Text>}
        {conversations.map(item => (
          <Text style={style.item} key={item.conversation.receivedTime}>
            {JSON.stringify(item, null, 2)}
          </Text>
        ))}
      </ScrollView>
    );
  }
}
