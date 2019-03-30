import * as React from "react";
import { Button, Picker, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { searchMessages } from "rongcloud-react-native-imlib";
import FormItem from "./form-item";
import { conversations } from "./constants";

const style = StyleSheet.create({
  body: { padding: 16 },
  item: { marginBottom: 8, fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" }
});

export default class extends React.PureComponent {
  static route = "SearchMessages";
  static navigationOptions = { title: "搜索消息" };

  state = {
    conversationType: 1,
    targetId: "vh6a0VoDJ",
    keyword: "",
    startTime: "0",
    count: "10",
    messages: []
  };

  setTargetId = targetId => this.setState({ targetId });
  setCount = count => this.setState({ count });
  setKeyword = keyword => this.setState({ keyword });
  setStartTime = startTime => this.setState({ startTime });

  searchMessages = async () => {
    const { conversationType, targetId, keyword, count, startTime } = this.state;
    if (!keyword) {
      return;
    }
    const messages = await searchMessages(
      conversationType,
      targetId,
      keyword,
      parseInt(count),
      parseInt(startTime)
    );
    this.setState({ messages });
  };

  render() {
    const { conversationType, targetId, keyword, startTime, count, messages } = this.state;
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
        <FormItem label="关键字">
          <TextInput value={keyword} onChangeText={this.setKeyword} placeholder="请输入关键字" />
        </FormItem>
        <FormItem label="个数">
          <TextInput
            value={count}
            keyboardType="numeric"
            onChangeText={this.setCount}
            placeholder="请输入个数"
          />
        </FormItem>
        <FormItem label="开始时间">
          <TextInput value={startTime} keyboardType="numeric" onChangeText={this.setStartTime} />
        </FormItem>
        <FormItem>
          <Button title="搜索消息" onPress={this.searchMessages} />
        </FormItem>
        {conversations.length === 0 && <Text style={style.item}>No messages.</Text>}
        {messages.map(item => (
          <Text style={style.item} key={item.messageId}>
            {JSON.stringify(item, null, 2)}
          </Text>
        ))}
      </ScrollView>
    );
  }
}
