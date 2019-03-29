import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { createDiscusstion } from "react-native-rongcloud-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "CreateDiscussion";
  static navigationOptions = { title: "创建讨论组" };

  state = {
    name: "",
    userList: "vh6a0VoDJ",
    result: []
  };

  setName = name => this.setState({ name });
  setUserList = userList => this.setState({ userList });

  createDiscussion = async () => {
    const { name, userList } = this.state;
    const result = await createDiscusstion(name, userList.split(","));
    this.setState({ result });
  };

  render() {
    const { name, userList } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="讨论组名称">
          <TextInput value={name} onChangeText={this.setName} placeholder="请输入讨论组名称" />
        </FormItem>
        <FormItem label="用户列表">
          <TextInput
            value={userList}
            onChangeText={this.setUserList}
            placeholder="请输入用户 ID 列表，以逗号分隔"
          />
        </FormItem>
        <FormItem>
          <Button title="创建讨论组" onPress={this.createDiscussion} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
