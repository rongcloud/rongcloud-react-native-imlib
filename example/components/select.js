import * as React from "react";
import { Picker } from "react-native";
import FormItem from "./form-item";

export default ({ label, options, value, onChange }) => (
  <FormItem label={label}>
    <Picker selectedValue={value} onValueChange={onChange}>
      {Object.keys(options).map(key => (
        <Picker.Item key={key} label={options[key]} value={key} />
      ))}
    </Picker>
  </FormItem>
);
