import * as React from "react";
import { Button, Picker, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { removeConversation } from "react-native-rongcloud-imlib";
import FormItem from "./form-item";
import { conversations } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  switch: { position: "absolute", right: 8 }
});

export default class extends React.PureComponent {
  static route = "RemoveConversation";
  static navigationOptions = { title: "移除会话" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });

  removeConversation = async () => {
    const { conversationType, targetId } = this.state;
    try {
      const result = await removeConversation(parseInt(conversationType), targetId);
      this.setState({ result: "会话移除成功：" + result });
    } catch (e) {
      console.error(e);
      this.setState({ result: "会话移除失败" });
    }
  };

  render() {
    const { targetId, conversationType, result } = this.state;
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
        <FormItem>
          <Button title="移除会话" onPress={this.removeConversation} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
