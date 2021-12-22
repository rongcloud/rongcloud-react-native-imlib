#import <React/RCTConvert.h>
#import <RongIMLib/RongIMLib.h>

@implementation RCTConvert (RCIMClib)

+ (RCCustomerServiceInfo *)RCCustomerServiceInfo:(id)json {
  RCCustomerServiceInfo *info = [RCCustomerServiceInfo new];
  info.name = json[@"name"];
  info.nickName = json[@"nickName"];
  info.loginName = json[@"loginName"];
  info.address = json[@"address"];
  info.age = json[@"age"];
  info.birthday = json[@"birthday"];
  info.city = json[@"city"];
  info.define = json[@"define"];
  info.email = json[@"email"];
  info.enterUrl = json[@"enterUrl"];
  info.gender = json[@"gender"];
  info.grade = json[@"grade"];
  info.memo = json[@"memo"];
  info.mobileNo = json[@"mobileNo"];
  info.page = json[@"page"];
  info.portraitUrl = json[@"portraitUrl"];
  info.productId = json[@"productId"];
  info.profession = json[@"profession"];
  info.province = json[@"province"];
  info.QQ = json[@"QQ"];
  info.referrer = json[@"referrer"];
  info.skillId = json[@"skillId"];
  info.userId = json[@"userId"];
  info.weibo = json[@"weibo"];
  info.weixin = json[@"weixin"];
  return info;
}

@end
