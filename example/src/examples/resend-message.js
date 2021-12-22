import * as React from "react";
import { TextInput, View, StyleSheet, Button } from "react-native";
import { FormItem, Result } from '../components'
import { resendMessageById } from "@rongcloud/react-native-imlib"


const style = StyleSheet.create({
    body: { padding: 16 },
    item: {
        marginBottom: 8,
        fontFamily: Platform.OS === "ios" ? "menlo" : "monospace"
    }
});
export default class extends React.PureComponent {
    static route = "resendMessageById";
    static navigationOptions = { title: "重发某条发送状态为失败的消息" };

    state = {
        messageId: "",
        result: "",
    }
    changeMessageId = messageId => {
        console.log(messageId);
        this.setState({ messageId })
    }

    send = () => {
        const callback = {
            success: messageId => {
                this.messageId = messageId;
                this.setState({ result: "消息发送成功：" + messageId });
            },
            progress: (progress, messageId) => {
                this.messageId = messageId;
                this.setState({ result: progress + "%" });
            },
            cancel: () => {
                this.setState({ result: "取消发送" });
            },
            error: (errorCode, messageId, message) => this.setState({ result: `消息发送失败：${errorCode}，${message}` })
        };
        if (this.state.messageId.length > 0) {
            resendMessageById(parseInt(this.state.messageId), "", "", callback);
        }
    }
    render() {
        return (
            <View style={style.body}>
                <FormItem label="请输入 messageId ">
                    <TextInput placeholder="请输入 messageId" onChangeText={this.changeMessageId}>
                    </TextInput>
                </FormItem>
                <FormItem>
                    <Button title="发送" onPress={this.send} />
                </FormItem>
                <Result>{this.state.result}</Result>
            </View>

        );
    }

}

