import * as React from "react";
import { Button, TextInput } from "react-native";
import { cleanRemoteHistoryMessages, getRemoteHistoryMessages } from "rongcloud-react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "GetRemoteHistoryMessages";
  static navigationOptions = { title: "获取服务端历史消息" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    messageType: "",
    sentTime: "0",
    count: "10",
    result: []
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
    this.setState({ result: JSON.stringify(messages, null, 2) });
  };

  cleanHistoryMessages = async () => {
    const { conversationType, targetId, sentTime } = this.state;
    await cleanRemoteHistoryMessages(conversationType, targetId, parseInt(sentTime));
    this.setState({ result: "清除服务端消息" });
  };

  render() {
    const { conversationType, targetId, sentTime, count, result } = this.state;
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
        <FormItem>
          <Button title="清除服务端历史消息" onPress={this.cleanHistoryMessages} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
