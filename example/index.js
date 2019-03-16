import { createAppContainer, createStackNavigator } from "react-navigation";
import { init } from "react-native-rongcloud-imlib";
import * as examples from "./examples";

init("n19jmcy59f1q9");

export default createAppContainer(
  createStackNavigator(examples, {
    initialRouteName: "default"
  })
);
