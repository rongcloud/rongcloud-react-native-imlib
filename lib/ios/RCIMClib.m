#import "RCIMClib.h"

@implementation RCIMClib {
}

RCT_EXPORT_MODULE(RCIMClient)

RCT_EXPORT_METHOD(init : (NSString *)key) {
  [RCIMClient.sharedRCIMClient initWithAppKey:key];
  [RCIMClient.sharedRCIMClient setRCConnectionStatusChangeDelegate:self];
  [RCIMClient.sharedRCIMClient setReceiveMessageDelegate:self object:nil];
}

RCT_EXPORT_METHOD(connect : (NSString *)token eventId : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient connectWithToken:token
      success:^(NSString *userId) {
        [self sendEventWithName:@"rcimlib-connect"
                           body:@{
                             @"type" : @"success",
                             @"eventId" : eventId,
                             @"userId" : userId
                           }];
      }
      error:^(RCConnectErrorCode code) {
        [self sendEventWithName:@"rcimlib-connect"
                           body:@{
                             @"type" : @"error",
                             @"eventId" : eventId,
                             @"errorCode" : @(code)
                           }];
      }
      tokenIncorrect:^{
        [self sendEventWithName:@"rcimlib-connect"
                           body:@{
                             @"type" : @"tokenIncorrect",
                             @"eventId" : eventId,
                           }];
      }];
}

- (void)onConnectionStatusChanged:(RCConnectionStatus)status {
  [self sendEventWithName:@"rcimlib-connection-status" body:@(status)];
}

- (void)onReceived:(RCMessage *)message left:(int)nLeft object:(id)object {
  [self sendEventWithName:@"rcimlib-receive-message"
                     body:@{
                       @"conversationType" : @(message.conversationType),
                       @"objectName" : message.objectName,
                       @"targetId" : message.targetId,
                       @"messageUId" : message.messageUId,
                       @"messageId" : @(message.messageId),
                       @"messageDirection" : @(message.messageDirection),
                       @"senderUserId" : message.senderUserId,
                       @"sentTime" : @(message.sentTime),
                       @"receivedTime" : @(message.receivedTime),
                    //    @"content" : [message.content rawJSONData],
                       @"extra" : message.extra,
                     }];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"rcimlib-connect", @"rcimlib-connection-status", @"rcimlib-receive-message"
  ];
}

@end
