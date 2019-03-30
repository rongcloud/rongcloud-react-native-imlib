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
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";
import { showImagePicker } from "react-native-image-picker";
import { sendMessage } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";
import { conversations, messageTypes } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});

export default class extends React.PureComponent {
  static route = "SendMessage";
  static navigationOptions = { title: "发送消息" };

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
        success: messageId => this.setState({ result: "消息发送成功：" + messageId }),
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
    const { targetId, conversationType, messageType, pushContent, result } = this.state;
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
        <FormItem label="推送内容">
          <TextInput value={pushContent} onChangeText={this.setPushContent} placeholder="请输入推送内容" />
        </FormItem>
        <FormItem>
          <Button title="发送" onPress={this.send} />
        </FormItem>
        <FormItem>
          <Text>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
