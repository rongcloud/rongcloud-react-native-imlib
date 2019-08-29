import { createAppContainer, createStackNavigator } from "react-navigation";
import { PermissionsAndroid } from "react-native";
import { init, connect } from "rongcloud-react-native-imlib";
import config from "./config";
import * as examples from "./examples";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).catch(() => {});
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).catch(() => {});

init(config.appKey);
connect(config.token);

export default createAppContainer(createStackNavigator(examples, { initialRouteName: "default" }));
