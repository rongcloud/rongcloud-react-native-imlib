import * as React from "react";
import { Button, Picker, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import {
  getConversationNotificationStatus,
  setConversationNotificationStatus
} from "rongcloud-react-native-imlib/src";
import FormItem from "./form-item";
import config from "../config";
import { conversations, conversationNotificationStatus } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  switch: { position: "absolute", right: 8 }
});

export default class extends React.PureComponent {
  static route = "ConversationNotificationStatus";
  static navigationOptions = { title: "会话消息提醒状态管理" };

  state = {
    conversationType: 1,
    targetId: config.targetUserId,
    status: "false",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });

  setStatus = async () => {
    const { conversationType, targetId, status } = this.state;
    console.log(typeof status, status);
    const result = await setConversationNotificationStatus(
      parseInt(conversationType),
      targetId,
      status === "true"
    );
    this.setState({ result: "设置消息提醒状态：" + result });
  };

  getStatus = async () => {
    const { conversationType, targetId } = this.state;
    const result = await getConversationNotificationStatus(parseInt(conversationType), targetId);
    this.setState({ result: "获取消息提醒状态：" + result });
  };

  render() {
    const { targetId, conversationType, status, result } = this.state;
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
        <FormItem label="消息提醒状态">
          <Picker selectedValue={status} onValueChange={status => this.setState({ status })}>
            {Object.keys(conversationNotificationStatus).map(key => (
              <Picker.Item key={key} label={conversationNotificationStatus[key]} value={key} />
            ))}
          </Picker>
        </FormItem>
        <FormItem>
          <Button title="设置会话状态" onPress={this.setStatus} />
        </FormItem>
        <FormItem>
          <Button title="获取会话状态" onPress={this.getStatus} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
