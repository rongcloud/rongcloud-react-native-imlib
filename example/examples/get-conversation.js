import * as React from "react";
import { Button, Picker, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getConversation } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";
import { conversations } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  switch: { position: "absolute", right: 8 }
});

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
          <Button title="获取会话" onPress={this.getConversation} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
