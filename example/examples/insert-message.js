import * as React from "react";
import { Button, TextInput } from "react-native";
import { insertIncomingMessage, insertOutgoingMessage } from "rongcloud-react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import config from "../config";
import { conversations, sentStatus } from "./constants";

export default class extends React.PureComponent {
  static route = "InsertMessage";
  static navigationOptions = { title: "插入消息" };

  state = {
    conversationType: 1,
    targetId: config.targetUserId,
    senderId: "8937",
    status: 10,
    receiveStatus: "0",
    content: { type: "text", content: "😀" },
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setSenderId = senderId => this.setState({ senderId });
  setReceiveStatus = receiveStatus => this.setState({ receiveStatus });
  setTextContent = content => this.setState({ content: { type: "text", content } });

  insert = async () => {
    const { conversationType, targetId, content, status } = this.state;
    try {
      const message = await insertOutgoingMessage(
        conversationType,
        targetId,
        parseInt(status),
        content
      );
      this.setState({ result: "消息插入成功：" + JSON.stringify(message, null, 2) });
    } catch (e) {
      console.error(e);
      this.setState({ result: "消息插入失败" });
    }
  };

  insert2 = async () => {
    const { conversationType, targetId, content, receiveStatus, senderId } = this.state;
    try {
      const message = await insertIncomingMessage(
        conversationType,
        targetId,
        senderId,
        parseInt(receiveStatus),
        content
      );
      this.setState({ result: "消息插入成功：" + JSON.stringify(message, null, 2) });
    } catch (e) {
      console.error(e);
      this.setState({ result: "消息插入失败" });
    }
  };

  render() {
    const {
      targetId,
      conversationType,
      status,
      result,
      content,
      receiveStatus,
      senderId
    } = this.state;
    return (
      <Body>
        <Select
          label="会话类型"
          options={conversations}
          value={conversationType}
          onChange={conversationType => this.setState({ conversationType })}
        />
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        <Select
          label="发送状态"
          options={sentStatus}
          value={status}
          onChange={status => this.setState({ status })}
        />
        <FormItem label="文本内容">
          <TextInput
            value={content.content}
            onChangeText={this.setTextContent}
            placeholder="请输入文本内容"
          />
        </FormItem>
        <FormItem>
          <Button title="插入接收消息" onPress={this.insert} />
        </FormItem>
        <FormItem label="接收状态">
          <TextInput
            value={receiveStatus}
            onChangeText={this.setReceiveStatus}
            placeholder="请输接收状态"
          />
        </FormItem>
        <FormItem label="发送人 ID">
          <TextInput
            value={senderId}
            onChangeText={this.setSenderId}
            placeholder="请输入发送人 ID"
          />
        </FormItem>
        <FormItem>
          <Button title="插入发送消息" onPress={this.insert2} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
