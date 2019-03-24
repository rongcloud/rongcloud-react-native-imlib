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

- (void)onReceived:(RCMessage *)message left:(int)left object:(id)object {
  [self sendEventWithName:@"rcimlib-receive-message"
                     body:[self dictionaryFromMessage:message]];
}

- (id)dictionaryFromMessage:(RCMessage *)message {
  return @{
    @"conversationType" : @(message.conversationType),
    @"objectName" : message.objectName,
    @"targetId" : message.targetId,
    @"messageUId" : message.messageUId,
    @"messageId" : @(message.messageId),
    @"messageDirection" : @(message.messageDirection),
    @"senderUserId" : message.senderUserId,
    @"sentTime" : @(message.sentTime),
    @"receivedTime" : @(message.receivedTime),
    @"content" : [self dictionaryFromMessageContent:message.content],
    @"extra" : message.extra,
  };
}

- (id)dictionaryFromMessageContent:(RCMessageContent *)content {
  if ([content isKindOfClass:[RCImageMessage class]]) {
    RCImageMessage *image = (RCImageMessage *)content;
    return @{
      @"type" : @"image",
      @"local" : image.localPath ? image.localPath : @"",
      @"remote" : image.remoteUrl ? image.remoteUrl : @"",
      @"isFull" : @(image.isFull),
      @"extra" : image.extra ? image.extra : @""
    };
  } else if ([content isKindOfClass:[RCTextMessage class]]) {
    RCTextMessage *text = (RCTextMessage *)content;
    return
        @{@"type" : @"text", @"content" : text.content, @"extra" : text.extra};
  } else if ([content isKindOfClass:[RCFileMessage class]]) {
    RCFileMessage *file = (RCFileMessage *)content;
    return @{
      @"type" : @"file",
      @"local" : file.localPath ? file.localPath : @"",
      @"remote" : file.remoteUrl ? file.remoteUrl : @"",
      @"name" : file.name,
      @"fileType": file.type,
      @"size": @(file.size),
      @"extra" : file.extra ? file.extra : @"",
    };
  }
  return nil;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"rcimlib-connect", @"rcimlib-connection-status", @"rcimlib-receive-message"
  ];
}

@end
