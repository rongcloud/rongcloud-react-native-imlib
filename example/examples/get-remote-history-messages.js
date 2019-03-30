import * as React from "react";
import { Picker, Platform, ScrollView, StyleSheet, Text, TextInput, Button } from "react-native";
import { getRemoteHistoryMessages, MessageObjectNames } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";
import { conversations } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "GetRemoteHistoryMessages";
  static navigationOptions = { title: "获取服务端历史消息" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    messageType: "",
    sentTime: "0",
    count: "10",
    messages: []
  };

  setTargetId = targetId => this.setState({ targetId });
  setCount = count => this.setState({ count });
  setSentTime = sentTime => this.setState({ sentTime });

  getHistoryMessages = async () => {
    const { conversationType, targetId, sentTime, count } = this.state;
    const messages = await getRemoteHistoryMessages(
      conversationType,
      targetId,
      parseInt(sentTime),
      parseInt(count)
    );
    console.log(messages);
    this.setState({ messages });
  };

  render() {
    const { messages, conversationType, targetId, sentTime, count } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="会话类型">
          <Picker
            selectedValue={conversationType}
            onValueChange={conversationType => this.setState({ conversationType })}
          >
            {Object.keys(conversations).map(key => (
              <Picker.Item key={key} label={conversations[key]} value={key} />
            ))}
          </Picker>
        </FormItem>
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        <FormItem label="截止的消息发送时间">
          <TextInput
            value={sentTime}
            keyboardType="numeric"
            onChangeText={this.setSentTime}
            placeholder="截止的消息发送时间"
          />
        </FormItem>
        <FormItem label="个数">
          <TextInput
            value={count}
            keyboardType="numeric"
            onChangeText={this.setCount}
            placeholder="请输入个数"
          />
        </FormItem>
        <FormItem>
          <Button title="获取消息" onPress={this.getHistoryMessages} />
        </FormItem>
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
