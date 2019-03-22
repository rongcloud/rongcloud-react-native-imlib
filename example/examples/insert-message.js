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
import { insertOutgoingMessage } from "react-native-rongcloud-imlib";
import FormItem from "./form-item";
import { conversations, sentStatus } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});

export default class extends React.PureComponent {
  static route = "InsertMessage";
  static navigationOptions = { title: "插入消息" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    sentStatus: 10,
    content: {},
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setTextContent = content => this.setState({ content: { type: "text", content } });

  insert = async () => {
    const { conversationType, targetId, content, status } = this.state;
    const result = await insertOutgoingMessage(conversationType, targetId, content, status);
    console.log(result);
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
    const { targetId, conversationType, status, result } = this.state;
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
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        <FormItem label="发送状态">
          <Picker selectedValue={status} onValueChange={status => this.setState({ status })}>
            {Object.keys(sentStatus).map(key => (
              <Picker.Item key={key} label={sentStatus[key]} value={key} />
            ))}
          </Picker>
        </FormItem>
        <FormItem label="文本内容">
          <TextInput onChangeText={this.setTextContent} placeholder="请输入文本内容" />
        </FormItem>
        <FormItem>
          <Button title="插入消息" onPress={this.insert} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
