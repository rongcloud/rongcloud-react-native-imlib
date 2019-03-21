import * as React from "react";
import { Text, ScrollView, StyleSheet, Platform } from "react-native";
import * as IMClient from "react-native-rongcloud-imlib";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "ReceiveMessage";
  static navigationOptions = { title: "接收消息" };

  state = { messages: [] };

  componentDidMount() {
    this.listener = IMClient.addReceiveMessageListener(message => {
      console.log(message);
      this.setState({ messages: [message, ...this.state.messages] });
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    const { messages } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        {messages.length === 0 && <Text style={style.item}>No messages.</Text>}
        {messages.map(message => (
          <Text style={style.item} key={message.messageId}>
            {JSON.stringify(message, null, 2)}
          </Text>
        ))}
      </ScrollView>
    );
  }
}
