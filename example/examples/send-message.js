import * as React from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import { showImagePicker } from "react-native-image-picker";
import {
  sendMessage,
  sendMediaMessage,
  recallMessage,
  cancelSendMediaMessage,
  ObjectName
} from "rongcloud-react-native-imlib/src";
import config from "../config";
import { Body, FormItem, Result, Select } from "../components";
import { conversations, messageTypes } from "./constants";

const style = StyleSheet.create({
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});

export default class extends React.PureComponent {
  static route = "SendMessage";
  static navigationOptions = { title: "发送消息" };

  messageId = 0;

  state = {
    conversationType: 1,
    messageType: ObjectName.Text,
    targetId: config.targetUserId,
    pushContent: "",
    content: {},
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setTextContent = content => this.setState({ content: { type: "text", content } });
  setPushContent = pushContent => this.setState({ pushContent });
  setConversationType = conversationType => this.setState({ conversationType });
  setVoice = voice =>
    this.setState({
      content: { objectName: ObjectName.Voice, data: voice, local: voice, duration: 2 }
    });

  setMessageType = messageType => {
    this.setState({ messageType });
    if (messageType === "location") {
      this.setState({
        content: {
          objectName: ObjectName.Location,
          latitude: 23,
          longitude: 102,
          name: "海龙大厦",
          thumbnail: "https://www.rongcloud.cn/images/logo.png"
        }
      });
    }
  };

  pickImage = () => {
    showImagePicker({}, ({ uri }) => {
      if (uri) {
        this.setState({ content: { objectName: ObjectName.Image, local: uri, isFull: true } });
      }
    });
  };

  pickFile = () => {
    DocumentPicker.show({ filetype: [DocumentPickerUtil.allFiles()] }, (error, response) => {
      if (response) {
        this.setState({ content: { objectName: ObjectName.File, local: response.uri } });
      }
    });
  };

  send = () => {
    const { conversationType, targetId, content, pushContent } = this.state;
    const message = { conversationType, targetId, content, pushContent };
    const callback = {
      success: messageId => {
        this.messageId = messageId;
        this.setState({ result: "消息发送成功：" + messageId });
      },
      progress: (progress, messageId) => {
        this.messageId = messageId;
        this.setState({ result: progress + "%" });
      },
      cancel: () => {
        this.setState({ result: "取消发送" });
      },
      error: (errorCode, messageId, message) => this.setState({ result: `消息发送失败：${errorCode}，${message}` })
    };
    if (content.objectName === ObjectName.Image || content.objectName === ObjectName.File) {
      sendMediaMessage(message, callback);
    } else {
      sendMessage(message, callback);
    }
  };

  cancel = () => cancelSendMediaMessage(this.messageId);

  recall = async () => {
    if (!this.messageId) {
      return;
    }
    await recallMessage(this.messageId);
    this.setState({ result: "消息撤回" });
  };

  renderContent() {
    const { messageType, content } = this.state;
    if (messageType === ObjectName.Text) {
      return (
        <FormItem label="文本内容">
          <TextInput onChangeText={this.setTextContent} placeholder="请输入文本内容" />
        </FormItem>
      );
    } else if (messageType === ObjectName.Image) {
      return (
        <FormItem>
          <Button title="选择图片" onPress={this.pickImage} />
          {content.local && (
            <Image style={style.image} resizeMode="contain" source={{ uri: content.local }} />
          )}
        </FormItem>
      );
    } else if (messageType === ObjectName.File) {
      return (
        <View>
          <FormItem>
            <Button title="选择文件" onPress={this.pickFile} />
          </FormItem>
          {content.local && (
            <FormItem>
              <Text>{content.local}</Text>
            </FormItem>
          )}
        </View>
      );
    } else if (messageType === ObjectName.Voice) {
      return (
        <View>
          <FormItem label="音频">
            <TextInput onChangeText={this.setVoice} placeholder="请输音频地址/数据" />
          </FormItem>
        </View>
      );
    }
  }

  render() {
    const { targetId, conversationType, messageType, pushContent, result } = this.state;
    return (
      <Body>
        <Select
          label="会话类型"
          options={conversations}
          value={conversationType}
          onChange={this.setConversationType}
        />
        <Select
          label="消息类型"
          options={messageTypes}
          value={messageType}
          onChange={this.setMessageType}
        />
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        {this.renderContent()}
        <FormItem label="推送内容">
          <TextInput
            value={pushContent}
            onChangeText={this.setPushContent}
            placeholder="请输入推送内容"
          />
        </FormItem>
        <FormItem>
          <Button title="发送" onPress={this.send} />
        </FormItem>
        <FormItem>
          <Button title="取消媒体消息的发送" onPress={this.cancel} />
        </FormItem>
        <FormItem>
          <Button title="撤回" onPress={this.recall} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
