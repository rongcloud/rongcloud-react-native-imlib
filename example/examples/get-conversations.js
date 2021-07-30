import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getConversationList } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "GetConversations";
  static navigationOptions = { title: "获取会话列表" };

  state = {
    conversationTypes: "1, 2",
    conversations: []
  };

  setConversationTypes = conversationTypes => this.setState({ conversationTypes });

  getConversations = async () => {
    const { conversationTypes } = this.state;
    const conversations = await getConversationList(
      conversationTypes.split(",").map(i => parseInt(i))
    );
    console.log(conversations);
    this.setState({ conversations });
  };

  render() {
    const { conversationTypes, conversations } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="会话类型">
          <TextInput
            value={conversationTypes}
            onChangeText={this.setConversationTypes}
            placeholder="请输入会话类型，以逗号分隔"
          />
        </FormItem>
        <FormItem>
          <Button title="获取会话列表" onPress={this.getConversations} />
        </FormItem>
        {conversations.length === 0 && <Text style={style.item}>No messages.</Text>}
        {conversations.map(item => (
          <Text style={style.item} key={item.receivedTime}>
            {JSON.stringify(item, null, 2)}
          </Text>
        ))}
      </ScrollView>
    );
  }
}
