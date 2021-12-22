import * as React from "react";
import { Button, TextInput } from "react-native";
import { startCustomerService } from "@rongcloud/react-native-imlib";
import { Body, FormItem, Result } from "../components";

export default class extends React.PureComponent {
  static route = "CustomerService";
  static navigationOptions = { title: "客服" };

  state = {
    targetId: "service",
    groupId: "",
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setGroupId = groupId => this.setState({ groupId });

  start = () => {
    const info = { nickName: "7c00", referrer: "20001" };
    const { targetId } = this.state;
    return startCustomerService(targetId, info, {
      success: config => {
        this.setState({ result: JSON.stringify(config, null, 2) });
      },
      error: (code, message) => {
        this.setState({ result: `${code}, ${message}` });
      }
    });
  };

  render() {
    const { targetId, groupId, result } = this.state;
    return (
      <Body>
        <FormItem label="客服 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入客服 ID" />
        </FormItem>
        <FormItem label="分组 ID">
          <TextInput value={groupId} onChangeText={this.setGroupId} />
        </FormItem>
        <FormItem>
          <Button title="开始客服聊天" onPress={this.start} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
