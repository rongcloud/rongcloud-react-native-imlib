import * as React from "react";
import { Button, Picker, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { insertOutgoingMessage } from "react-native-rongcloud-imlib";
import FormItem from "./form-item";
import { conversations, sentStatus } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});

export default class extends React.PureComponent {
  static route = "InsertMessage";
  static navigationOptions = { title: "插入消息" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    status: 10,
    content: { type: "text", content: "😀" },
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setTextContent = content => this.setState({ content: { type: "text", content } });

  insert = async () => {
    const { conversationType, targetId, content, status } = this.state;
    try {
      const message = await insertOutgoingMessage(conversationType, targetId, status, content);
      this.setState({ result: "消息插入成功：" + JSON.stringify(message, null, 2) });
    } catch (e) {
      console.error(e);
      this.setState({ result: "消息插入失败" });
    }
  };

  render() {
    const { targetId, conversationType, status, result, content } = this.state;
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
        <FormItem label="发送状态">
          <Picker selectedValue={status} onValueChange={status => this.setState({ status })}>
            {Object.keys(sentStatus).map(key => (
              <Picker.Item key={key} label={sentStatus[key]} value={key} />
            ))}
          </Picker>
        </FormItem>
        <FormItem label="文本内容">
          <TextInput
            value={content.content}
            onChangeText={this.setTextContent}
            placeholder="请输入文本内容"
          />
        </FormItem>
        <FormItem>
          <Button title="插入消息" onPress={this.insert} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
