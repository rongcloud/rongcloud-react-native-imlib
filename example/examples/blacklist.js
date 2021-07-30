import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { addToBlacklist, getBlacklist, removeFromBlacklist } from "rongcloud-react-native-imlib";
import config from "../config";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "Blacklist";
  static navigationOptions = { title: "黑名单" };

  state = { userId: config.targetUserId, result: "" };

  setUserId = userId => this.setState({ userId });

  addToBlacklist = async () => {
    const { userId } = this.state;
    await addToBlacklist(userId);
    this.setState({ result: "加入黑名单" });
  };

  removeFromBlacklist = async () => {
    const { userId } = this.state;
    await removeFromBlacklist(userId);
    this.setState({ result: "移出黑名单" });
  };

  getBlacklist = async () => {
    const blacklist = await getBlacklist();
    this.setState({ result: "黑名单：" + blacklist });
  };

  render() {
    const { userId, result } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="用户 ID">
          <TextInput value={userId} onChangeText={this.setUserId} placeholder="请输用户 ID" />
        </FormItem>
        <FormItem>
          <Button title="加入黑名单" onPress={this.addToBlacklist} />
        </FormItem>
        <FormItem>
          <Button title="移出黑名单" onPress={this.removeFromBlacklist} />
        </FormItem>
        <FormItem>
          <Button title="获取黑名单" onPress={this.getBlacklist} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
