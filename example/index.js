import { createAppContainer, createStackNavigator } from "react-navigation";
import { PermissionsAndroid } from "react-native";
import { init, connect } from "rongcloud-react-native-imlib";
import * as examples from "./examples";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).catch(() => {});
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).catch(() => {});

init("n19jmcy59f1q9");
connect("GyiWR3+J9MN2nnQKAKTQj6+YsUIoF3ojin3K277sfOlzmwyaFIqt4ywGjGYzfknK8p3EwTTEBuTpBvu3HvGkH6tdpZUyLdaH");

// init("x18ywvqfxcn2c");
// connect("Mp1SlOClkC5imMrnO5xIsAoSTn8t701T7AbwThntqeIQasCHd35DQRg6FtTrjEPC/GN4Ijv1uf2D3sMjvYRkgQ==");

export default createAppContainer(
  createStackNavigator(examples, {
    initialRouteName: "default"
  })
);
