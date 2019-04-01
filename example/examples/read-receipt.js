import * as React from "react";
import { Button, TextInput } from "react-native";
import {
  addReadReceiptReceivedListener,
  sendMessage,
  sendReadReceiptMessage
} from "rongcloud-react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "ReadReceipt";
  static navigationOptions = { title: "消息回执" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    timestamp: Date.now().toString(),
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setConversationType = conversationType => this.setState({ conversationType });
  setTimestamp = timestamp => this.setState({ timestamp });

  sendReadReceipt = () => {
    const { conversationType, targetId, timestamp } = this.state;
    return sendReadReceiptMessage(parseInt(conversationType), targetId, parseInt(timestamp));
  };

  sendMessage = () => {
    const { conversationType, targetId } = this.state;
    sendMessage({ conversationType, targetId, content: { type: "text", content: "test" } });
  };

  componentDidMount() {
    this.listener = addReadReceiptReceivedListener(message =>
      this.setState({ result: JSON.stringify({ type: "ReadReceiptReceived", message }, null, 2) })
    );
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    const { targetId, conversationType, timestamp, result } = this.state;
    return (
      <Body>
        <Select
          label="会话类型"
          options={conversations}
          value={conversationType}
          onChange={this.setConversationType}
        />
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        <FormItem label="阅读时间戳">
          <TextInput value={timestamp} onChangeText={this.setTimestamp} />
        </FormItem>
        <FormItem>
          <Button title="发送一条消息（以触发对方的消息回执）" onPress={this.sendMessage} />
        </FormItem>
        <FormItem>
          <Button title="发送消息回执" onPress={this.sendReadReceipt} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
