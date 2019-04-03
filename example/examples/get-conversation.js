import * as React from "react";
import { Button, TextInput } from "react-native";
import { getConversation, setConversationToTop, getTopConversationList } from "rongcloud-react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "GetConversation";
  static navigationOptions = { title: "获取会话" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });

  getConversation = async () => {
    const { conversationType, targetId } = this.state;
    try {
      const conversation = await getConversation(parseInt(conversationType), targetId);
      this.setState({ result: JSON.stringify(conversation, null, 2) });
    } catch (e) {
      console.error(e);
      this.setState({ result: "获取会话失败" });
    }
  };

  setConversationToTop(isTop) {
    const { conversationType, targetId } = this.state;
    setConversationToTop(parseInt(conversationType), targetId, isTop);
  }

  getTopConversations = async () => {
    const { conversationType } = this.state;
    const conversations = await getTopConversationList([parseInt(conversationType)]);
    this.setState({ result: JSON.stringify(conversations, null, 2) });
  };

  render() {
    const { targetId, conversationType, result } = this.state;
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
        <FormItem>
          <Button title="获取会话" onPress={this.getConversation} />
        </FormItem>
        <FormItem>
          <Button title="置顶会话" onPress={() => this.setConversationToTop(true)} />
        </FormItem>
        <FormItem>
          <Button title="取消置顶会话" onPress={() => this.setConversationToTop(false)} />
        </FormItem>
        <FormItem>
          <Button title="获取置顶会话" onPress={this.getTopConversations} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
