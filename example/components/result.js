import * as React from "react";
import { Text, Platform } from "react-native";
import FormItem from "./form-item";

const style = { fontFamily: Platform.OS === "ios" ? "menlo" : "monospace" };

export default ({ children }) => (
  <FormItem>
    <Text style={style}>{children}</Text>
  </FormItem>
);
