import * as React from "react";
import { ScrollView } from "react-native";
import Example from "./example";
import Connect from "./connect";
import ReceiveMessage from "./receive-message";
import SendMessage from "./send-message";
import GetHistoryMessages from "./get-history-messages";
import InsertMessage from "./insert-message";

const examples = [Connect, ReceiveMessage, SendMessage, GetHistoryMessages, InsertMessage];

export default class extends React.PureComponent {
  static navigationOptions = { title: "RongCloud IMLib Examples" };

  render() {
    return (
      <ScrollView>
        {examples.map(({ navigationOptions: { title }, route }) => (
          <Example key={route} title={title} route={route} />
        ))}
      </ScrollView>
    );
  }
}

export { Connect, ReceiveMessage, SendMessage, GetHistoryMessages, InsertMessage };
