import * as React from "react";
import { Button, Text, TextInput } from "react-native";
import { searchPublicService } from "rongcloud-react-native-imlib";
import { FormItem, Select, Body, Result } from "../components";
import { searchTypes, publicServiceTypes } from "./constants";

export default class extends React.PureComponent {
  static route = "PublicService";
  static navigationOptions = { title: "公众服务" };

  state = { keyword: "融云", searchType: 1, publicServiceType: 0, result: "" };

  setKeyword = keyword => this.setState({ keyword });
  setSearchType = searchType => this.setState({ searchType });
  setPublicServiceType = publicServiceType => this.setState({ publicServiceType });

  searchPublicService = async () => {
    const { keyword, searchType, publicServiceType } = this.state;
    const result = await searchPublicService(keyword, searchType, publicServiceType);
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  render() {
    const { keyword, searchType, publicServiceType, result } = this.state;
    return (
      <Body>
        <FormItem label="关键字">
          <TextInput value={keyword} onChangeText={this.setKeyword} placeholder="请输关键字" />
        </FormItem>
        <Select
          label="搜索类型"
          options={searchTypes}
          value={searchType}
          onChange={this.setSearchType}
        />
        <Select
          label="公众号类型"
          options={publicServiceTypes}
          value={publicServiceType}
          onChange={this.setPublicServiceType}
        />
        <FormItem>
          <Button title="搜索公众号" onPress={this.searchPublicService} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
