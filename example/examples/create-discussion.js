import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import {
  addMemberToDiscussion,
  createDiscussion,
  getDiscussion,
  quitDiscussion,
  removeMemberFromDiscussion,
  setDiscussionInviteStatus,
  setDiscussionName
} from "react-native-rongcloud-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "CreateDiscussion";
  static navigationOptions = { title: "讨论组" };

  state = {
    name: "标题什么的",
    userList: "vh6a0VoDJ",
    discussionId: "aa327807-da31-4971-9c81-a5142042d6b4",
    result: []
  };

  setName = name => this.setState({ name });
  setUserList = userList => this.setState({ userList });
  setDiscussionId = discussionId => this.setState({ discussionId });

  createDiscussion = async () => {
    const { name, userList } = this.state;
    const discussionId = await createDiscussion(name, userList.split(","));
    this.setState({ result: "创建成功：" + discussionId, discussionId });
  };

  getDiscussion = async () => {
    const { discussionId } = this.state;
    const result = await getDiscussion(discussionId);
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  addMemberToDiscussion = async () => {
    const { discussionId, userList } = this.state;
    await addMemberToDiscussion(discussionId, userList.split(","));
    return this.getDiscussion();
  };

  setDiscussionName = async () => {
    const { discussionId, name } = this.state;
    await setDiscussionName(discussionId, name);
    return this.getDiscussion();
  };

  removeMemberFromDiscussion = async () => {
    const { discussionId, userList } = this.state;
    await removeMemberFromDiscussion(discussionId, userList.split(",")[0]);
    return this.getDiscussion();
  };

  setDiscussionIsOpen = async isOpen => {
    const { discussionId } = this.state;
    await setDiscussionInviteStatus(discussionId, isOpen);
    return this.getDiscussion();
  };

  render() {
    const { name, userList, result, discussionId } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="讨论组 ID">
          <TextInput
            value={discussionId}
            onChangeText={this.setDiscussionId}
            placeholder="请输入讨论组 ID"
          />
        </FormItem>
        <FormItem label="讨论组名称">
          <TextInput value={name} onChangeText={this.setName} placeholder="请输入讨论组名称" />
        </FormItem>
        <FormItem label="用户 ID 列表">
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
          <Button title="获取讨论组信息" onPress={this.getDiscussion} />
        </FormItem>
        <FormItem>
          <Button title="把用户加入讨论组" onPress={this.addMemberToDiscussion} />
        </FormItem>
        <FormItem>
          <Button title="把用户移出讨论组" onPress={this.removeMemberFromDiscussion} />
        </FormItem>
        <FormItem>
          <Button title="设置讨论组名称" onPress={this.setDiscussionName} />
        </FormItem>
        <FormItem>
          <Button title="设置讨论组可邀请" onPress={() => this.setDiscussionIsOpen(true)} />
        </FormItem>
        <FormItem>
          <Button title="设置讨论组不可邀请" onPress={() => this.setDiscussionIsOpen(false)} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
