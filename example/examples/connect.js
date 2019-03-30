import * as React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { addConnectionStatusListener, connect, disconnect } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";

const style = StyleSheet.create({ body: { padding: 16 }, message: { marginTop: 16 } });

export default class extends React.PureComponent {
  static route = "Connect";
  static navigationOptions = { title: "连接服务器" };

  state = {
    message: "连接结果：",
    status: 0,
    token:
      "FrdcuKklUMoGh+VkhUxezXxpRjANxKgfakOnYLFljI9gLUrCB690FgW7+nh1NhEYZUsv73YwHabXQU7yFrr8ow=="
  };

  componentDidMount() {
    this.listener = addConnectionStatusListener(status => this.setState({ status }));
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  setToken = token => this.setState({ token });

  connect = () =>
    connect(
      this.state.token,
      userId => this.setState({ message: "连接成功：" + userId }),
      errorCode => this.setState({ message: "连接失败：" + errorCode }),
      () => this.setState({ message: "Token 不正确或已过期" })
    );

  render() {
    const { status, message, token } = this.state;
    return (
      <View style={style.body}>
        <FormItem label="Token">
          <TextInput value={token} onChangeText={this.setToken} placeholder="请提供 Token" />
        </FormItem>
        <FormItem>
          <Button title="连接服务器" onPress={this.connect} />
        </FormItem>
        <FormItem>
          <Button title="断开连接（继续接收推送）" onPress={() => disconnect()} />
        </FormItem>
        <FormItem>
          <Button title="断开连接（不再接收推送）" onPress={() => disconnect(false)} />
        </FormItem>
        <Text style={style.message}>{message}</Text>
        <Text style={style.message}>连接状态监听：{status}</Text>
      </View>
    );
  }
}
