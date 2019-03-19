import { createAppContainer, createStackNavigator } from "react-navigation";
import { init, connect } from "react-native-rongcloud-imlib";
import * as examples from "./examples";

init("n19jmcy59f1q9");
connect("FrdcuKklUMoGh+VkhUxezXxpRjANxKgfakOnYLFljI9gLUrCB690FgW7+nh1NhEYZUsv73YwHabXQU7yFrr8ow==");

export default createAppContainer(
  createStackNavigator(examples, {
    initialRouteName: "default"
  })
);
