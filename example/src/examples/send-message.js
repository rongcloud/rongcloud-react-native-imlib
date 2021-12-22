import * as React from "react";
import { Alert, Button, Image, StyleSheet, Text, TextInput, View, PermissionsAndroid, Platform } from "react-native";
import DocumentPicker from "react-native-document-picker";
import ImagePicker from "react-native-image-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  sendMessage,
  sendMediaMessage,
  recallMessage,
  cancelSendMediaMessage,
  ObjectName
} from "@rongcloud/react-native-imlib";
import config from "../config";
import { Body, FormItem, Result, Select } from "../components";
import { conversations, messageTypes } from "./constants";

const style = StyleSheet.create({
  image: { height: 100, marginTop: 16, marginBottom: 16 }
});


export default class extends React.PureComponent {
  static route = "SendMessage";
  static navigationOptions = { title: "发送消息" };
  messageId = 0;
  
  state = {
    conversationType: 1,
    messageType: ObjectName.Text,
    targetId: config.targetUserId,
    pushContent: "",
    content: {},
    result: "",
    userInfo : {name:"",userId:"",portraitUrl:"",extra:""},
    attached:""
  };

  setUserId = userId => {
    let data = Object.assign({},this.state.userInfo,{userId:userId});
    let contentData = Object.assign({},this.state.content,{userInfo:data});
    this.setState({
      userInfo:data,
      content:contentData
    })
  }
  setName = name => {
    let data = Object.assign({},this.state.userInfo,{name:name});
    let contentData = Object.assign({},this.state.content,{userInfo:data});
    this.setState({
      userInfo:data,
      content:contentData
    })
  }
  setPortraitUrl = portraitUrl => {
    let data = Object.assign({},this.state.userInfo,{portraitUrl:portraitUrl});
    let contentData = Object.assign({},this.state.content,{userInfo:data});
    this.setState({
      userInfo:data,
      content:contentData
    })
  }
  setExtra = extra => {
    let data = Object.assign({},this.state.userInfo,{extra:extra});
    let contentData = Object.assign({},this.state.content,{userInfo:data});
    this.setState({
      userInfo:data,
      content:contentData
    })
  }
  setTargetId = targetId => this.setState({ targetId });
  setTextContent = content => {
    console.log(this.state.userInfo);
    this.setState({
      content: { objectName: ObjectName.Text, content,userInfo:this.state.userInfo} 
     })
  };
  setPushContent = pushContent => this.setState({ pushContent });
  setConversationType = conversationType => this.setState({ conversationType });
  setVoice = voice =>
    this.setState({
      content: { objectName: ObjectName.Voice, data: voice, local: voice, duration: 2 }
    });

  setMessageType = messageType => {
    this.setState({ messageType });
    if (messageType === ObjectName.Location) {
      this.setState({
        content: {
          objectName: ObjectName.Location,
          latitude: 39.98350639461544,
          longitude: 116.31588033766451,
          name: "海龙大厦",
          thumbnail: "https://apng.onevcat.com/assets/elephant.png",
          userInfo:this.state.userInfo
        }
      });
    }
  };

  pickImage = async () => {

    if (Platform.OS === 'android') {
      let canUse = await this.requestCameraPermission();
      if (!canUse) {
         return;
      }
    }

   let options = {
     'mediaType': 'photo'
   };
    ImagePicker.showImagePicker(options, ({ uri }) => {
      if (uri) {
        this.setState({ content: { objectName: ObjectName.Image, local: uri, isFull: true ,userInfo:this.state.userInfo} });
      }
    });
  };

  pickFile = async () => {
    let response = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles] });
    let uri = response.uri;
    if (Platform.OS === 'ios') {
      uri = decodeURI(response.uri);
    }
    if (response) {
      this.setState({ content: { objectName: ObjectName.File, local: uri ,userInfo:this.state.userInfo} });
    }
  };

  pickVoiceFile = async() => {
    let response = await DocumentPicker.pick({type: [DocumentPicker.types.audio]});
    let uri = response.uri;
    if (Platform.OS === 'ios') {
      uri = decodeURI(response.uri);
    }
    if (response) {
      this.setState({
        content: { objectName: ObjectName.HQVoice, data: uri, local: uri, duration: 2 ,userInfo:this.state.userInfo}
      });
    }
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:
            "App 需要获取您的相机权限后，才能进行拍照或选取相册 ",
          buttonNeutral: "稍后",
          buttonNegative: "取消",
          buttonPositive: "好的"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        return true;
      } else {
        console.log("Camera permission denied");
        Alert.alert('相机权限没打开', '请在手机的“设置”选项中,允许访问您的摄像头');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  
  send = () => {
    const { conversationType, targetId, content, pushContent } = this.state;
    const message = { conversationType: parseInt(conversationType), targetId, content, pushContent };
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
      error: (errorCode, messageId, message) => this.setState({ result: `消息发送失败：${errorCode}，${messageId}，${message}` }),
      attached: (message) => {
        this.setState({ attached: `${message.objectName}` });
      }
    };
    if (content.objectName === ObjectName.Image || content.objectName === ObjectName.File || content.objectName === ObjectName.HQVoice) {
      sendMediaMessage(message, callback);
    } else {
      sendMessage(message, callback);
    }
  };

  cancel = () => cancelSendMediaMessage(this.messageId);

  recall = async () => {
    if (!this.messageId) {
      return;
    }
    await recallMessage(this.messageId);
    this.setState({ result: "消息撤回" });
  };

  renderContent() {
    const { messageType, content } = this.state;
    if (messageType === ObjectName.Text) {
      return (
        <FormItem label="文本内容">
          <TextInput onChangeText={this.setTextContent} placeholder="请输入文本内容" />
        </FormItem>
      );
    } else if (messageType === ObjectName.Image) {
      return (
        <FormItem>
          <Button title="选择图片" onPress={this.pickImage} />
          {content.local && (
            <Image style={style.image} resizeMode="contain" source={{ uri: content.local }} />
          )}
        </FormItem>
      );
    } else if (messageType === ObjectName.File) {
      return (
        <View>
          <FormItem>
            <Button title="选择文件" onPress={this.pickFile} />
          </FormItem>
          {content.local && (
            <FormItem>
              <Text>{content.local}</Text>
            </FormItem>
          )}
        </View>
      );
    } else if (messageType === ObjectName.HQVoice) {
      return (
        <View>
          {/* <FormItem label="音频">
            <TextInput onChangeText={this.setVoice} placeholder="请输音频地址/数据" />
          </FormItem> */}
          <FormItem>
            <Button title="选择音频数据" onPress={this.pickVoiceFile} />
          </FormItem>
          {content.local && (
            <FormItem>
              <Text>{content.local}</Text>
            </FormItem>
          )}
        </View>
      );
    }
  }

  render() {
    const { targetId, conversationType, messageType, pushContent, result, userInfo, attached } = this.state;
    let behavior = Platform.OS == 'ios' ? 'padding' : null;
    return (
      <KeyboardAwareScrollView style={{flex: 1}}>
        <Body>
        <Select
          label="会话类型"
          options={conversations}
          value={conversationType}
          onChange={this.setConversationType}
        />
        <Select
          label="消息类型"
          options={messageTypes}
          value={messageType}
          onChange={this.setMessageType}
        />
        <FormItem label="目标 ID">
          <TextInput value={targetId} onChangeText={this.setTargetId} placeholder="请输入目标 ID" />
        </FormItem>
        {this.renderContent()}
        <FormItem label="推送内容">
          <TextInput
            value={pushContent}
            onChangeText={this.setPushContent}
            placeholder="请输入推送内容"
          />
        </FormItem>

        <FormItem label="用户信息">
          <Text>name</Text>
          <TextInput
            onChangeText={this.setName}
            placeholder="请输入名字"
          />
          <Text>id</Text>
          <TextInput
            onChangeText={this.setUserId}
            placeholder="请输入id"
          />
          <Text>portraitUrl</Text>
          <TextInput
            onChangeText={this.setPortraitUrl}
            placeholder="请输入头像地址"
          />
          <Text>extra</Text>
          <TextInput
            onChangeText={this.setExtra}
            placeholder="请输入扩展信息"
          />
        </FormItem>
        <FormItem>
          <Button title="发送" onPress={this.send} />
        </FormItem>
        <FormItem>
          <Button title="取消媒体消息的发送" onPress={this.cancel} />
        </FormItem>
        <FormItem>
          <Button title="撤回" onPress={this.recall} />
        </FormItem>

        <Result>{attached}</Result>
        <Result>{result}</Result>
      </Body>
      </KeyboardAwareScrollView>
    );
  }
}
