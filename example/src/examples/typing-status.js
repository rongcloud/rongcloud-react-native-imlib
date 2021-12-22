import * as React from "react";
import { Button, TextInput } from "react-native";
import { sendTypingStatus, addTypingStatusListener } from "@rongcloud/react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import config from "../config";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "TypingStatus";
  static navigationOptions = { title: "输入状态" };

  state = {
    conversationType: 1,
    targetId: config.targetUserId,
    typingContentType: "正在输入",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setConversationType = conversationType => this.setState({ conversationType });
  setTypingContentType = typingContentType => this.setState({ typingContentType });

  sendTypingStatus = () => {
    const { conversationType, targetId, typingContentType } = this.state;
    return sendTypingStatus(parseInt(conversationType), targetId, typingContentType);
  };

  componentDidMount() {
    this.listener = addTypingStatusListener((conversationType, targetId, status) =>
      this.setState({ result: { conversationType, targetId, status } })
    );
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    const { targetId, conversationType, typingContentType, result } = this.state;
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
        <FormItem label="输入内容类型">
          <TextInput value={typingContentType} onChangeText={this.setTypingContentType} />
        </FormItem>
        <FormItem>
          <Button title="发送输入状态" onPress={this.sendTypingStatus} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
