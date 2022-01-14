import * as React from "react";
import { Button, TextInput, View } from "react-native";
import {
  sendMessage,
  getMessageByUId,
  ConversationType,
  sendReadReceiptMessage,
  sendReadReceiptRequest,
  sendReadReceiptResponse,
  setReceiptRequestListener,
  setReceiptResponseListener,
  setReadReceiptReceivedListener,
} from "@rongcloud/react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import config from "../config";
import { conversations } from "./constants";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class extends React.PureComponent {
  static route = "ReadReceipt";
  static navigationOptions = { title: "消息回执" };

  state = {
    conversationType: 1,
    targetId: config.targetUserId,
    timestamp: Date.now().toString(),
    result: "",
    messageId: '',
    messageUId: '',
  };

  setTargetId = targetId => this.setState({ targetId });
  setConversationType = conversationType => this.setState({ conversationType });
  setTimestamp = timestamp => this.setState({ timestamp });
  setMessageUId = messageUId => this.setState({ messageUId });

  sendReadReceipt = () => {
    const { conversationType, targetId, timestamp } = this.state;
    if (parseInt(this.state.conversationType) === ConversationType.PRIVATE) {
      return sendReadReceiptMessage(parseInt(conversationType), targetId, parseInt(timestamp));
    }
    return sendReadReceiptRequest(parseInt(conversationType), targetId, parseInt(timestamp));
  }

  sendReadReceiptRequest = () => {
    sendReadReceiptRequest(this.messageId);
  }

  sendReadReceiptResponse = async () => {
    const { conversationType, targetId, messageUId } = this.state;
    let message = await getMessageByUId(messageUId);
    sendReadReceiptResponse(parseInt(conversationType), targetId, [message]);
  }

  sendMessage = () => {
    const { conversationType, targetId } = this.state;
    const callback = {
      success: messageId => {
        this.messageId = messageId;
        this.setState({ result: "消息发送成功：messageId: " + messageId });
      },
      progress: (progress, messageId) => {
        this.messageId = messageId;
        // this.setState({ result: progress + "%" });
      },
      cancel: () => {
        // this.setState({ result: "取消发送" });
      },
      error: (errorCode, messageId, message) => this.setState({ result: `消息发送失败：${errorCode}，${message}` })
    };
    sendMessage({ conversationType: parseInt(conversationType), targetId, content: { type: "text", content: "test" } }, callback);
  };

  componentDidMount() {
    // 单聊 回执
    this.listener = setReadReceiptReceivedListener(message =>
      this.setState({ result: JSON.stringify({ type: "ReadReceiptReceived", message }, null, 2) })
    );

    // 群聊 回执请求
    this.receiptRequestListener = setReceiptRequestListener(message => {
      this.setState({ result: JSON.stringify({ type: "GroupReadReceiptRequest", message }, null, 2) })
    });

    // 群聊 回执响应
    this.receiptResponseListener = setReceiptResponseListener(message => {
      this.setState({ result: JSON.stringify({ type: "GroupReadReceiptResponse", message }, null, 2) })
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    const { targetId, conversationType, timestamp, result, messageUId } = this.state;
    return (
      <KeyboardAwareScrollView>
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
          {
            parseInt(this.state.conversationType) != ConversationType.PRIVATE && 
            <FormItem label="消息 messageUId (发送消息回执响应的时候需要填写)">
              <TextInput value={messageUId} onChangeText={this.setMessageUId} placeholder="请输入消息 messageUId " />
            </FormItem>
          }
          <FormItem label="阅读时间戳">
            <TextInput value={timestamp} onChangeText={this.setTimestamp} />
          </FormItem>
          <FormItem>
            <Button title="发送一条消息（以触发对方的消息回执）" onPress={this.sendMessage} />
          </FormItem>
          {this.renderReadReceiptButton()}
          <FormItem>
            <TextInput value={result} multiline={true} style={{ height: 100 }} />
          </FormItem>
        </Body>
      </KeyboardAwareScrollView>

    );
  }

  renderReadReceiptButton() {
    if (parseInt(this.state.conversationType) === ConversationType.PRIVATE) {
      return (
        <FormItem>
          <Button title="发送消息回执" onPress={this.sendReadReceipt} />
        </FormItem>
      );
    }
    return (
      <View>
        <FormItem>
          <Button title="发送消息回执请求" onPress={this.sendReadReceiptRequest} />
        </FormItem>
        <FormItem>
          <Button title="发送消息回执响应" onPress={this.sendReadReceiptResponse} />
        </FormItem>
      </View>
    )
  }
}
