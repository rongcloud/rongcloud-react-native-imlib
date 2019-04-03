import * as React from "react";
import { Button, TextInput } from "react-native";
import {
  cleanRemoteHistoryMessages,
  getRemoteChatroomHistoryMessages,
  getRemoteHistoryMessages
} from "rongcloud-react-native-imlib";

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
    order: 0,
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

  getRemoteChatroomHistoryMessages = async () => {
    const { targetId, sentTime, count, order } = this.state;
    const messages = await getRemoteChatroomHistoryMessages(
      targetId,
      parseInt(sentTime),
      parseInt(count),
      order
    );
    this.setState({ result: JSON.stringify(messages, null, 2) });
  };

  cleanHistoryMessages = async () => {
    const { conversationType, targetId, sentTime } = this.state;
    await cleanRemoteHistoryMessages(conversationType, targetId, parseInt(sentTime));
    this.setState({ result: "清除服务端消息" });
  };

  render() {
    const { conversationType, targetId, sentTime, count, order, result } = this.state;
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
        <Select
          label="时间戳排序"
          options={{ 0: "倒序", 1: "顺序" }}
          value={order}
          onChange={order => this.setState({ order })}
        />
        <FormItem>
          <Button title="获取服务端聊天室消息" onPress={this.getRemoteChatroomHistoryMessages} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
