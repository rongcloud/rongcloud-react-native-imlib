import * as React from "react";
import {
  Button,
  Image,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { ConversationType, sendMessage } from "react-native-rongcloud-imlib";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import FormItem from "./form-item";

const conversations = {
  [ConversationType.PRIVATE]: "私聊",
  [ConversationType.DISCUSSION]: "讨论组",
  [ConversationType.GROUP]: "群组",
  [ConversationType.CHATROOM]: "聊天室",
  [ConversationType.CUSTOMER_SERVICE]: "客服"
};

const messageTypes = { text: "文本消息", image: "图片消息", file: "文件消息" };

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});

export default class extends React.PureComponent {
  static route = "SendMessage";
  static navigationOptions = { title: "发送消息" };

  state = {
    conversationType: 1,
    messageType: "text",
    targetId: "vh6a0VoDJ",
    content: {},
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setTextContent = content => this.setState({ content: { type: "text", content } });

  pickImage = () => {
    DocumentPicker.show({ filetype: [DocumentPickerUtil.images()] }, (error, response) => {
      if (response) {
        this.setState({ content: { type: "image", local: response.uri } });
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
    const { conversationType, targetId, content } = this.state;
    sendMessage(
      { conversationType, targetId, content },
      {
        success: message =>
          this.setState({ result: "消息发送成功：" + JSON.stringify(message, null, 2) }),
        error: errorCode => this.setState({ result: "消息发送失败：" + errorCode })
      }
    );
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
    }
  }

  render() {
    const { targetId, conversationType, messageType, result } = this.state;
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
        <FormItem label="消息类型">
          <Picker
            selectedValue={messageType}
            onValueChange={messageType => this.setState({ messageType })}
          >
            {Object.keys(messageTypes).map(key => (
              <Picker.Item key={key} label={messageTypes[key]} value={key} />
            ))}
          </Picker>
        </FormItem>
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        {this.renderContent()}
        <FormItem>
          <Button title="发送" onPress={this.send} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
