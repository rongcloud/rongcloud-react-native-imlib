import * as React from "react";
import { Text, Image, View, TextInput, Button, Picker, StyleSheet } from "react-native";
import { sendMediaMessage, ConversationType } from "react-native-rongcloud-imlib";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";

const conversations = {
  [ConversationType.PRIVATE]: "私聊",
  [ConversationType.DISCUSSION]: "讨论组",
  [ConversationType.GROUP]: "群组",
  [ConversationType.CHATROOM]: "聊天室",
  [ConversationType.CUSTOMER_SERVICE]: "客服"
};

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginTop: 16 },
  image: { height: 100, marginTop: 8, marginBottom: 8 }
});

export default class extends React.PureComponent {
  static route = "SendFileMessage";
  static navigationOptions = { title: "发送文件消息" };

  state = { conversationType: 1, targetId: "vh6a0VoDJ", result: "" };

  setTargetId = targetId => this.setState({ targetId });

  send = () => {
    const { conversationType, targetId, localUri } = this.state;
    const content = { type: "file", localUrl: localUri };
    sendMediaMessage(
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

  pick = () => {
    DocumentPicker.show({ filetype: [DocumentPickerUtil.allFiles()] }, (error, response) => {
      console.log(response);
      if (response) {
        this.setState({ localUri: response.uri });
      }
    });
  };

  render() {
    const { targetId, conversationType, result, localUri } = this.state;
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
        <TextInput
          value={targetId}
          onChangeText={this.setTargetId}
          placeholder="请输入 Target ID"
        />
        <Button title="选择图片" onPress={this.pick} />
        <View style={{ padding: 8 }}>
          {localUri && (
            <Image style={style.image} resizeMode="contain" source={{ uri: localUri }} />
          )}
        </View>
        <Button title="发送" onPress={this.send} />
        <Text style={style.item}>{result}</Text>
      </View>
    );
  }
}
