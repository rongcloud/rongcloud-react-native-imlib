import * as React from "react";
import {
  Button,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput
} from "react-native";
import { clearMessages, deleteMessages } from "rongcloud-react-native-imlib";
import config from "../config";
import FormItem from "./form-item";
import { conversations } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  result: { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" },
  switch: { position: "absolute", right: 8 }
});

export default class extends React.PureComponent {
  static route = "DeleteMessages";
  static navigationOptions = { title: "清除会话消息" };

  state = {
    conversationType: 1,
    targetId: config.targetUserId,
    isClearDatabase: false,
    result: ""
  };

  setTargetId = targetId => this.setState({ targetId });
  setIsClearDatabase = isClearDatabase => this.setState({ isClearDatabase });

  deleteMessages = async () => {
    const { conversationType, targetId, isClearDatabase } = this.state;
    try {
      if (isClearDatabase) {
        await deleteMessages(conversationType, targetId);
      } else {
        await clearMessages(conversationType, targetId);
      }
      this.setState({ result: "删除成功" });
    } catch (e) {
      console.error(e);
      this.setState({ result: "删除失败" });
    }
  };

  render() {
    const { targetId, conversationType, isClearDatabase, result } = this.state;
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
        <FormItem label="同时清理数据库">
          <Switch
            style={style.switch}
            value={isClearDatabase}
            onValueChange={this.setIsClearDatabase}
          />
        </FormItem>
        <FormItem>
          <Button title="清除会话消息" onPress={this.deleteMessages} />
        </FormItem>
        <FormItem>
          <Text style={style.result}>{result}</Text>
        </FormItem>
      </ScrollView>
    );
  }
}
