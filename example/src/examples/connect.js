import * as React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  setConnectionStatusListener,
  connect,
  disconnect,
  setReconnectKickEnable
} from "@rongcloud/react-native-imlib";
import config from "../config";
import { Picker } from '@react-native-picker/picker';
import FormItem from "./form-item";

const style = StyleSheet.create({ body: { padding: 16 }, message: { marginTop: 16 } });

export default class extends React.PureComponent {
  static route = "Connect";
  static navigationOptions = { title: "连接服务器" };


  state = {
    message: "连接结果：",
    status: 0,
    token: ""
  };

  componentDidMount() {
    this.listener = setConnectionStatusListener(status => this.setState({ status }));
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  setToken = token => this.setState({token:token})

  connect = () =>
    connect(
      this.state.token,
      userId => this.setState({ message: "连接成功：" + userId }),
      errorCode => this.setState({ message: "连接失败：" + errorCode }),
      () => this.setState({ message: "Token 不正确或已过期" })
    );

  render() {
    const { status, message, token } = this.state;
    var items = [];
    config.forEach(element => {
      items.push(<Picker.Item label={element.targetUserId} value={element.token}></Picker.Item>);
    })
    
    return (
      <View style={style.body}>
        <FormItem label="请选择用户">
          <Picker selectedValue={token}
            onValueChange={this.setToken}>
            {items}
          </Picker>
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
        <FormItem>
          <Button title="断线重连时踢出重连设备" onPress={() => setReconnectKickEnable(true)} />
        </FormItem>
        <FormItem>
          <Button title="断线重连时不踢出重连设备" onPress={() => setReconnectKickEnable(true)} />
        </FormItem>
        <Text style={style.message}>{message}</Text>
        <Text style={style.message}>连接状态监听：{status}</Text>
      </View>
    );
  }
}
