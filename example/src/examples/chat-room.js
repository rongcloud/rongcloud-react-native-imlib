import * as React from "react";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import {
  joinChatRoom,
  joinExistChatRoom,
  quitChatRoom,
  getChatRoomInfo
} from "@rongcloud/react-native-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "ChatRoom";
  static navigationOptions = { title: "聊天室" };

  state = { targetId: "vh6a0VoDJ", result: "" };

  setTargetId = targetId => this.setState({ targetId });

  joinChatRoom = async () => {
    const { targetId } = this.state;
    await joinChatRoom(targetId);
    this.setState({ result: "加入&聊天室" });
  };

  joinExistChatRoom = async () => {
    const { targetId } = this.state;
    try {
      await joinExistChatRoom(targetId);
      this.setState({ result: "加入聊天室" });
    } catch (e) {
      console.log(e);
    }
  };

  getChatRoomInfo = async () => {
    const { targetId } = this.state;
    const chatRoomInfo = await getChatRoomInfo(targetId);
    this.setState({ result: JSON.stringify(chatRoomInfo, null, 2) });
  };

  quitChatRoom = async () => {
    const { targetId } = this.state;
    await quitChatRoom(targetId);
    this.setState({ result: "退出聊天室" });
  };

  render() {
    const { targetId, result } = this.state;
    return (
      <ScrollView contentContainerStyle={style.body}>
        <FormItem label="聊天室 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="聊天室 ID" />
        </FormItem>
        <FormItem>
          <Button title="加入&创建聊天室" onPress={this.joinChatRoom} />
        </FormItem>
        <FormItem>
          <Button title="加入聊天室" onPress={this.joinExistChatRoom} />
        </FormItem>
        <FormItem>
          <Button title="获取聊天室信息" onPress={this.getChatRoomInfo} />
        </FormItem>
        <FormItem>
          <Button title="退出聊天室" onPress={this.quitChatRoom} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
