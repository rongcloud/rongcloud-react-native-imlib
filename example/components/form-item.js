import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

const style = StyleSheet.create({ item: { marginBottom: 16 }, label: { marginBottom: 8 } });

export default ({ label, children }) => (
  <View style={style.item}>
    {label && <Text style={style.label}>{label}</Text>}
    {children}
  </View>
);
