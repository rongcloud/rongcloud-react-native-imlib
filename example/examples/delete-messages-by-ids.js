import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { clearMessages, deleteMessages } from "react-native-rongcloud-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  switch: { position: "absolute", right: 8 }
});

export default class extends React.PureComponent {
  static route = "DeleteMessagesByIds";
  static navigationOptions = { title: "通过消息 ID 列表删除消息" };

  state = { ids: "", result: "" };

  setIds = ids => this.setState({ ids });

  deleteMessages = async () => {
    const { ids } = this.state;
    try {
      await deleteMessages(ids.split(",").map(i => parseInt(i)));
      this.setState({ result: "删除成功" });
    } catch (e) {
      console.error(e);
      this.setState({ result: "删除失败" });
    }
  };

  render() {
    const { ids, result } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="消息 ID">
          <TextInput
            value={ids}
            onChangeText={this.setIds}
            placeholder="请输入要删除的消息 ID，以逗号分隔"
          />
        </FormItem>
        <FormItem>
          <Button title="删除消息" onPress={this.deleteMessages}/>
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
