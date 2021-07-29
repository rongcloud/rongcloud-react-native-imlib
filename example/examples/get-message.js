import * as React from "react";
import { Button, TextInput } from "react-native";
import { getMessage, getMessageByUId } from "rongcloud-react-native-imlib/src";
import { Body, FormItem, Result } from "../components";

export default class extends React.PureComponent {
  static route = "GetMessage";
  static navigationOptions = { title: "获取消息" };

  state = { messageId: "", result: "" };

  setMessageId = messageId => this.setState({ messageId });

  getMessage = async () => {
    const { messageId } = this.state;
    const message = await getMessage(parseInt(messageId));
    this.setState({ result: JSON.stringify(message, null, 2) });
  };

  getMessageByUId = async () => {
    const { messageId } = this.state;
    const message = await getMessageByUId(messageId);
    this.setState({ result: JSON.stringify(message, null, 2) });
  };

  render() {
    const { messageId, result } = this.state;
    return (
      <Body>
        <FormItem label="消息 ID 或消息 UId">
          <TextInput value={messageId} onChangeText={this.setMessageId} placeholder="请输入" />
        </FormItem>
        <FormItem>
          <Button title="获取消息（通过 ID）" onPress={this.getMessage} />
        </FormItem>
        <FormItem>
          <Button title="获取会话（通过 UID）" onPress={this.getMessageByUId} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
