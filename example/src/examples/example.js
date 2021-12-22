import * as React from "react";
import { withNavigation } from "react-navigation";
import {
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet
} from "react-native";

let Touchable = TouchableHighlight;
if (Platform.OS === "android") {
  Touchable = TouchableNativeFeedback;
}

const style = StyleSheet.create({ text: { padding: 16, fontSize: 18 } });

export default withNavigation(
  class extends React.PureComponent {
    onPress = () => this.props.navigation.navigate(this.props.route);

    render() {
      return (
        <Touchable onPress={this.onPress}>
          <View>
            <Text style={style.text}>{this.props.title}</Text>
          </View>
        </Touchable>
      );
    }
  }
);
