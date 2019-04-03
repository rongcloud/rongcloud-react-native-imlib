import * as React from "react";
import { Button, TextInput } from "react-native";
import {
  clearTextMessageDraft,
  getTextMessageDraft,
  saveTextMessageDraft
} from "rongcloud-react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "TextMessageDraft";
  static navigationOptions = { title: "消息草稿" };

  state = { conversationType: 1, targetId: "vh6a0VoDJ", content: "", result: "" };

  setTargetId = targetId => this.setState({ targetId });
  setContent = content => this.setState({ content });

  setDraft = async () => {
    const { conversationType, targetId, content } = this.state;
    const result = await saveTextMessageDraft(parseInt(conversationType), targetId, content);
    this.setState({ result: "保存消息草稿：" + result });
  };

  getDraft = async () => {
    const { conversationType, targetId } = this.state;
    const result = await getTextMessageDraft(parseInt(conversationType), targetId);
    this.setState({ result: "消息草稿：" + result });
  };

  clearDraft = async () => {
    const { conversationType, targetId } = this.state;
    await clearTextMessageDraft(parseInt(conversationType), targetId);
    this.setState({ result: "清除草稿" });
  };

  render() {
    const { targetId, conversationType, content, result } = this.state;
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
        <FormItem label="草稿内容">
          <TextInput value={content} onChangeText={this.setContent} placeholder="请输入草稿内容" />
        </FormItem>
        <FormItem>
          <Button title="保存消息草稿" onPress={this.setDraft} />
        </FormItem>
        <FormItem>
          <Button title="获取消息草稿" onPress={this.getDraft} />
        </FormItem>
        <FormItem>
          <Button title="清除消息草稿" onPress={this.clearDraft} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
