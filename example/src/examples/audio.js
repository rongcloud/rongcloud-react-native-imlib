import * as React from "react";
import { Button, TextInput, PermissionsAndroid } from "react-native";
import { sendMediaMessage, ConversationType, ObjectName } from "@rongcloud/react-native-imlib";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Body, FormItem, Result, Select } from "../components";
import config from "../config";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "Audio";
  static navigationOptions = { title: "语音消息" };

  audio = new AudioRecorderPlayer();

  state = {
    conversationType: ConversationType.PRIVATE,
    targetId: config.targetUserId,
    local: "",
    result: "",
    recording: false
  };

  setTargetId = targetId => this.setState({ targetId });

  setConversationType = conversationType => this.setState({ conversationType });

  sendMessage = () => {
    const { conversationType, targetId, local } = this.state;
    const content = { objectName: ObjectName.HQVoice, local, duration: 2 };
    const message = { conversationType: parseInt(conversationType), targetId, content };
    const callback = {
      success: messageId => {
        this.messageId = messageId;
        this.setState({ result: "消息发送成功：" + messageId });
      },
      error: (errorCode, messageId, message) =>
        this.setState({ result: `消息发送失败：${errorCode}，${message}` })
    };
    sendMediaMessage(message, callback);
  };

  record = async () => {
    const { recording } = this.state;
    this.setState({ recording: !recording });
    if (recording) {
      const result = await this.audio.stopRecorder();
      this.setState({ result });
    } else {
      const result = await this.audio.startRecorder();
      this.setState({ result, local: result });
    }
  };

  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).catch(() => {});
  }

  render() {
    const { conversationType, targetId, result, recording } = this.state;
    return (
      <Body>
        <Select
          label="会话类型"
          options={conversations}
          value={conversationType}
          onChange={this.setConversationType}
        />
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        <FormItem>
          <Button title={recording ? "停止录音" : "开始录音"} onPress={this.record} />
        </FormItem>
        <FormItem>
          <Button title="发送消息" onPress={this.sendMessage} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
