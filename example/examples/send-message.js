import * as React from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import { showImagePicker } from "react-native-image-picker";
import { sendMessage, recallMessage } from "rongcloud-react-native-imlib";
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
    messageType: "text",
    targetId: "vh6a0VoDJ",
    pushContent: "",
    content: {},
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setTextContent = content => this.setState({ content: { type: "text", content } });
  setPushContent = pushContent => this.setState({ pushContent });
  setConversationType = conversationType => this.setState({ conversationType });
  setVoice = voice =>
    this.setState({ content: { type: "voice", data: voice, local: voice, duration: 2 } });
  setMessageType = messageType => {
    this.setState({ messageType });
    if (messageType === "location") {
      this.setState({
        content: {
          type: "location",
          latitude: 23,
          longitude: 102,
          name: "海龙大厦",
          thumbnail:
            "https://restapi.amap.com/v3/staticmap?scale=2&location=116.37359,39.92437&zoom=10&size=216*140&markers=mid,,A:116.37359,39.92437&key=ee95e52bf08006f63fd29bcfbcf21df0"
        }
      });
    }
  };

  pickImage = () => {
    showImagePicker({}, ({ uri }) => {
      if (uri) {
        this.setState({ content: { type: "image", local: uri } });
      }
    });
  };

  pickFile = () => {
    DocumentPicker.show({ filetype: [DocumentPickerUtil.allFiles()] }, (error, response) => {
      if (response) {
        this.setState({ content: { type: "file", local: response.uri } });
      }
    });
  };

  send = () => {
    const { conversationType, targetId, content, pushContent } = this.state;
    sendMessage(
      { conversationType, targetId, content, pushContent },
      {
        success: messageId => {
          this.messageId = messageId;
          this.setState({ result: "消息发送成功：" + messageId });
        },
        error: errorCode => this.setState({ result: "消息发送失败：" + errorCode })
      }
    );
  };

  recall = async () => {
    if (!this.messageId) {
      return;
    }
    await recallMessage(this.messageId);
    this.setState({ result: "消息撤回" });
  };

  renderContent() {
    const { messageType, content } = this.state;
    if (messageType === "text") {
      return (
        <FormItem label="文本内容">
          <TextInput onChangeText={this.setTextContent} placeholder="请输入文本内容" />
        </FormItem>
      );
    } else if (messageType === "image") {
      return (
        <FormItem>
          <Button title="选择图片" onPress={this.pickImage} />
          {content.local && (
            <Image style={style.image} resizeMode="contain" source={{ uri: content.local }} />
          )}
        </FormItem>
      );
    } else if (messageType === "file") {
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
    } else if (messageType === "voice") {
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
          <Button title="撤回" onPress={this.recall} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
