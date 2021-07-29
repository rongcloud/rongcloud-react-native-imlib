import * as React from "react";
import { Button, TextInput } from "react-native";
import {
  getPublicServiceList,
  getPublicServiceProfile,
  searchPublicService,
  subscribePublicService,
  unsubscribePublicService
} from "rongcloud-react-native-imlib/src";
import { Body, FormItem, Result, Select } from "../components";
import { publicServiceTypes, searchTypes } from "./constants";

export default class extends React.PureComponent {
  static route = "PublicService";
  static navigationOptions = { title: "公众服务" };

  state = {
    keyword: "融云",
    searchType: 1,
    publicServiceType: 0,
    publicServiceId: "mc_1000",
    result: ""
  };

  setKeyword = keyword => this.setState({ keyword });
  setSearchType = searchType => this.setState({ searchType });
  setPublicServiceType = publicServiceType => this.setState({ publicServiceType });
  setPublicServiceId = publicServiceId => this.setState({ publicServiceId });

  searchPublicService = async () => {
    const { keyword, searchType, publicServiceType } = this.state;
    const result = await searchPublicService(keyword, searchType, parseInt(publicServiceType));
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  getPublicServiceProfile = async () => {
    const { publicServiceType, publicServiceId } = this.state;
    const result = await getPublicServiceProfile(parseInt(publicServiceType), publicServiceId);
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  getPublicServiceList = async () => {
    const result = await getPublicServiceList();
    this.setState({ result: JSON.stringify(result, null, 2) });
  };

  subscribePublicService = async () => {
    const { publicServiceType, publicServiceId } = this.state;
    await subscribePublicService(parseInt(publicServiceType), publicServiceId);
    this.setState({ result: "订阅公共服务" });
  };

  unsubscribePublicService = async () => {
    const { publicServiceType, publicServiceId } = this.state;
    await unsubscribePublicService(parseInt(publicServiceType), publicServiceId);
    this.setState({ result: "取消订阅公共服务" });
  };

  render() {
    const { keyword, searchType, publicServiceType, publicServiceId, result } = this.state;
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
          label="公众服务类型"
          options={publicServiceTypes}
          value={publicServiceType}
          onChange={this.setPublicServiceType}
        />
        <FormItem label="公众服务 ID">
          <TextInput
            value={publicServiceId}
            onChangeText={this.setPublicServiceId}
            placeholder="请输入公众服务 ID"
          />
        </FormItem>
        <FormItem>
          <Button title="搜索公众服务" onPress={this.searchPublicService} />
        </FormItem>
        <FormItem>
          <Button title="订阅公众服务" onPress={this.subscribePublicService} />
        </FormItem>
        <FormItem>
          <Button title="取消订阅公众服务" onPress={this.unsubscribePublicService} />
        </FormItem>
        <FormItem>
          <Button title="获取公众服务信息" onPress={this.getPublicServiceProfile} />
        </FormItem>
        <FormItem>
          <Button title="获取已订阅的公众服务" onPress={this.getPublicServiceList} />
        </FormItem>
        <Result>{result}</Result>
      </Body>
    );
  }
}
