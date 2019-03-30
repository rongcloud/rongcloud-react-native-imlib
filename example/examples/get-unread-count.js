import * as React from "react";
import { Button, Picker, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getUnreadCount } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";
import { conversations } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "GetUnreadCount";
  static navigationOptions = { title: "获取未读消息数" };

  state = {
    conversationTypes: "1, 2",
    conversationType: "1",
    targetId: "vh6a0VoDJ",
    result: ""
  };

  setConversationTypes = conversationTypes => this.setState({ conversationTypes });

  getUnreadCountByTypes = async () => {
    const { conversationTypes } = this.state;
    const count = await getUnreadCount(conversationTypes.split(",").map(i => parseInt(i)));
    this.setState({ result: "未读消息数：" + count });
  };

  getUnreadCount = async () => {
    const { conversationType, targetId } = this.state;
    const count = await getUnreadCount(parseInt(conversationType), targetId);
    this.setState({ result: "未读消息数：" + count });
  };

  render() {
    const { conversationTypes, conversationType, targetId, result } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="会话类型">
          <TextInput
            value={conversationTypes}
            onChangeText={this.setConversationTypes}
            placeholder="请输入会话类型，以逗号分隔"
          />
        </FormItem>
        <FormItem>
          <Button title="获取指定会话类型的未读消息" onPress={this.getUnreadCountByTypes} />
        </FormItem>
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
        <FormItem>
          <Button title="获取指定会话的未读消息" onPress={this.getUnreadCount} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
