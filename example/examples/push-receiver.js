import * as React from "react";
import { Button } from "react-native";
import {
  addPushArrivedListener,
  setPushContentShowStatus,
  getPushContentShowStatus
} from "rongcloud-react-native-imlib";
import { Body, FormItem, Result } from "../components";

export default class extends React.PureComponent {
  static route = "PushReceiver";
  static navigationOptions = { title: "接收推送消息" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    typingContentType: "正在输入",
    result: ""
  };

  componentDidMount() {
    this.listener = addPushArrivedListener(message =>
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

  render() {
    const { result } = this.state;
    return (
      <Body>
        <FormItem>
          <Button title="显示推送内容详情" onPress={() => setPushContentShowStatus(true)} />
        </FormItem>
        <FormItem>
          <Button title="不显示推送内容详情" onPress={() => setPushContentShowStatus(false)} />
        </FormItem>
        <FormItem>
          <Button title="查询是否显示推送内容详情" onPress={this.getPushContentShowStatus} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
