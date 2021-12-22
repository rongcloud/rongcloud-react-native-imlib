import * as React from "react";
import { Button, TextInput } from "react-native";
import {
  getRealTimeLocationParticipants,
  getRealTimeLocationStatus,
  joinRealTimeLocation,
  quitRealTimeLocation,
  startRealTimeLocation
} from "@rongcloud/react-native-imlib";
import { Body, FormItem, Result, Select } from "../components";
import config from "../config";
import { conversations } from "./constants";

export default class extends React.PureComponent {
  static route = "RealTimeLocation";
  static navigationOptions = { title: "实时位置共享" };

  state = {
    conversationType: 1,
    targetId: config.targetUserId,
    typingContentType: "正在输入",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setConversationType = conversationType => this.setState({ conversationType });

  start = async () => {
    const { conversationType, targetId } = this.state;
    const a = await startRealTimeLocation(parseInt(conversationType), targetId);
    const result = ` 发起位置共享 ${a}`;
    this.setState({result: JSON.stringify(result, null, 2)});
  };

  join = async () => {
    const { conversationType, targetId } = this.state;
    const a = await joinRealTimeLocation(parseInt(conversationType), targetId);
    const result = ` 加入位置共享 ${a}`;
    this.setState({result: JSON.stringify(result, null, 2)});
  };

  quit = async () => {
    const { conversationType, targetId } = this.state;
    const a = await quitRealTimeLocation(parseInt(conversationType), targetId);
    const result = ` 退出位置共享 ${a}`;
    this.setState({result: JSON.stringify(result, null, 2)});
  };

  getStatus = async () => {
    const { conversationType, targetId } = this.state;
    const result = await getRealTimeLocationStatus(parseInt(conversationType), targetId);
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  getParticipants = async () => {
    const { conversationType, targetId } = this.state;
    const result = await getRealTimeLocationParticipants(parseInt(conversationType), targetId);
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  componentDidMount() {
    // this.listener = addTypingStatusListener((conversationType, targetId, status) =>
    //   this.setState({ result: { conversationType, targetId, status } })
    // );
  }

  componentWillUnmount() {
    // this.listener.remove();
  }

  render() {
    const { targetId, conversationType, result } = this.state;
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
          <Button title="发起实时位置共享" onPress={this.start} />
        </FormItem>
        <FormItem>
          <Button title="加入实时位置共享" onPress={this.join} />
        </FormItem>
        <FormItem>
          <Button title="退出实时位置共享" onPress={this.quit} />
        </FormItem>
        <FormItem>
          <Button title="获取实时位置共享状态" onPress={this.getStatus} />
        </FormItem>
        <FormItem>
          <Button title="获取参与实时位置共享的用户" onPress={this.getParticipants} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
