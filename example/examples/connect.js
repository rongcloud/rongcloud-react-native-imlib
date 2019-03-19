import * as React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as IMClient from "react-native-rongcloud-imlib";

const style = StyleSheet.create({
  body: { padding: 16 },
  message: { marginTop: 16 }
});

export default class extends React.PureComponent {
  static route = "Connect";
  static navigationOptions = { title: "连接服务器" };

  state = {
    message: "",
    status: null,
    token:
      "FrdcuKklUMoGh+VkhUxezXxpRjANxKgfakOnYLFljI9gLUrCB690FgW7+nh1NhEYZUsv73YwHabXQU7yFrr8ow=="
  };

  componentDidMount() {
    this.listener = IMClient.addConnectionStatusListener(status => this.setState({ status }));
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  setToken = token => this.setState({ token });

  connect = () =>
    IMClient.connect(
      this.state.token,
      userId => this.setState({ message: "连接成功：" + userId }),
      errorCode => this.setState({ message: "连接失败：" + errorCode }),
      () => this.setState({ message: "Token 不正确或已过期" })
    );

  render() {
    const { status, message, token } = this.state;
    return (
      <View style={style.body}>
        <TextInput value={token} onChangeText={this.setToken} placeholder="请提供 Token" />
        <Button title="连接服务器" onPress={this.connect} />
        <Text style={style.message}>{message}</Text>
        {status !== null && <Text style={style.message}>ConnectionStatusChange: {status}</Text>}
      </View>
    );
  }
}
