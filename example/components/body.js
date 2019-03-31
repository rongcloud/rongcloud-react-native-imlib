import * as React from "react";
import { ScrollView } from "react-native";

const style = { padding: 16 };

export default ({ children }) => <ScrollView contentContainerStyle={style}>{children}</ScrollView>;
