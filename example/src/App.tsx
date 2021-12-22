import * as React from 'react';
import { Platform, StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { init, connect, setServerInfo } from "@rongcloud/react-native-imlib";
import config from "./config";
import * as examples from "./examples";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).catch(() => {});
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).catch(() => {});

if (config.naviServer != null && config.naviServer.length > 0) {
     setServerInfo(config.naviServer, '');
}
init("n19jmcy59f1q9");

export default createAppContainer(createStackNavigator(examples, { initialRouteName: "default" }));
