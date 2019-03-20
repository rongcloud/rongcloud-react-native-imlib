import * as React from "react";
import { Image, Text, View, TextInput, Button, Picker, StyleSheet } from "react-native";
import ImagePicker from "react-native-image-picker";
import { sendMessage, ConversationType } from "react-native-rongcloud-imlib";

const conversations = {
  [ConversationType.PRIVATE]: "私聊",
  [ConversationType.DISCUSSION]: "讨论组",
  [ConversationType.GROUP]: "群组",
  [ConversationType.CHATROOM]: "聊天室",
  [ConversationType.CUSTOMER_SERVICE]: "客服"
};

const messageTypes = {
  text: "文本消息",
  image: "图片消息"
};

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginTop: 16 },
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});

export default class extends React.PureComponent {
  static route = "SendMessage";
  static navigationOptions = { title: "发送消息" };

  state = {
    conversationType: 1,
    messageType: "text",
    targetId: "",
    textContent: "",
    thumUri: "",
    localUri: "",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setTextContent = textContent => this.setState({ textContent });
  setThumUri = thumUri => this.setState({ thumUri });
  setLocalUri = localUri => this.setState({ localUri });

  pickImage = () => {
    ImagePicker.showImagePicker(null, response => {
      if (response.uri) {
        this.setState({ localUri: "file://" + response.path });
      }
    });
  };

  send = () => {
    const { conversationType, targetId, messageType, textContent, thumUri, localUri } = this.state;
    const content = { type: messageType };
    if (messageType === "text") {
      content.content = textContent;
    } else if (messageType === "image") {
      content.thumUri = thumUri;
      content.localUri = localUri;
    }
    sendMessage(
      conversationType,
      targetId,
      content,
      "",
      "",
      messageId => {
        this.setState({ result: "消息发送成功：" + messageId });
      },
      errorCode => {
        this.setState({ result: "消息发送失败：" + errorCode });
      }
    );
  };

  renderMessage() {
    const { messageType } = this.state;
    if (messageType === "text") {
      return (
        <TextInput
          defaultValue="vh6a0VoDJ"
          onChangeText={this.setTextContent}
          placeholder="请输入文本内容"
        />
      );
    } else if (messageType === "image") {
      return (
        <View>
          <TextInput
            defaultValue="https://placeimg.com/80/80"
            onChangeText={this.setThumUri}
            placeholder="请输入预览图片 URI"
          />
          <TextInput
            defaultValue="https://placeimg.com/800/800"
            onChangeText={this.setLocalUri}
            placeholder="请输入本地图片 URI"
          />
        </View>
      );
    }
  }

  render() {
    const { conversationType, messageType, result } = this.state;
    return (
      <View style={style.body}>
        <Picker
          selectedValue={conversationType}
          onValueChange={conversationType => this.setState({ conversationType })}
        >
          {Object.keys(conversations).map(key => (
            <Picker.Item key={key} label={conversations[key]} value={key} />
          ))}
        </Picker>
        <Picker
          selectedValue={messageType}
          onValueChange={messageType => this.setState({ messageType })}
        >
          {Object.keys(messageTypes).map(key => (
            <Picker.Item key={key} label={messageTypes[key]} value={key} />
          ))}
        </Picker>
        <TextInput onChangeText={this.setTargetId} placeholder="请输入 Target ID" />
        {this.renderMessage()}
        <Button title="发送" onPress={this.send} />
        <Text style={style.item}>{result}</Text>
      </View>
    );
  }
}
