import * as React from "react";
import { Button } from "react-native";
import {
  setPushArrivedListener,
  setPushContentShowStatus,
  getPushContentShowStatus
} from "@rongcloud/react-native-imlib";
import { Body, FormItem, Result } from "../components";

export default class extends React.PureComponent {
  static route = "PushReceiver";
  static navigationOptions = { title: "接收推送消息" };

  state = { result: "" };

  componentDidMount() {
    this.listener = setPushArrivedListener(message =>
      this.setState({ result: JSON.stringify(message, null, 2) })
    );
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  getPushContentShowStatus = async () => {
    const result = await getPushContentShowStatus();
    this.setState({ result: "是否显示推送内容详情：" + result });
  };

  async setPushContentShowStatus(status) {
    let res = await setPushContentShowStatus(status);
    console.log(res);
    if (res === undefined) {
      let str = status ? '显示推送内容详情' : '不显示推送内容详情';
      this.setState({ result: str + ' -> 设置成功' });
    }
  }

  render() {
    const { result } = this.state;
    return (
      <Body>
        <FormItem>
          <Button title="显示推送内容详情" onPress={() => this.setPushContentShowStatus(true)} />
        </FormItem>
        <FormItem>
          <Button title="不显示推送内容详情" onPress={() => this.setPushContentShowStatus(false)} />
        </FormItem>
        <FormItem>
          <Button title="查询是否显示推送内容详情" onPress={this.getPushContentShowStatus} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
