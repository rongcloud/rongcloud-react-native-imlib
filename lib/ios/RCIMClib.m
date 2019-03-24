#import "RCIMClib.h"

@implementation RCIMClib {
}

RCT_EXPORT_MODULE(RCIMClient)

RCT_EXPORT_METHOD(init : (NSString *)key) {
  [RCIMClient.sharedRCIMClient initWithAppKey:key];
  [RCIMClient.sharedRCIMClient setRCConnectionStatusChangeDelegate:self];
  [RCIMClient.sharedRCIMClient setReceiveMessageDelegate:self object:nil];
}

RCT_EXPORT_METHOD(connect : (NSString *)token : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient connectWithToken:token
      success:^(NSString *userId) {
        [self sendEventWithName:@"rcimlib-connect"
                           body:@{@"type" : @"success", @"eventId" : eventId, @"userId" : userId}];
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

/**
 * 发送消息
 */
RCT_EXPORT_METHOD(sendMessage : (NSDictionary *)message : (NSString *)eventId) {
  NSDictionary *content = message[@"content"];
  if (!content) {
    [self sendEventWithName:@"rcimlib-connect"
                       body:@{
                         @"type" : @"error",
                         @"eventId" : eventId,
                       }];
    return;
  }

  void (^successBlock)(long messageId) = ^(long messageId) {
    [self sendEventWithName:@"rcimlib-send-message"
                       body:@{
                         @"type" : @"success",
                         @"eventId" : eventId,
                         @"messageId" : @(messageId),
                       }];
  };

  void (^errorBlock)(RCErrorCode errorCode, long messageId) =
      ^(RCErrorCode errorCode, long messageId) {
        [self sendEventWithName:@"rcimlib-send-message"
                           body:@{
                             @"type" : @"error",
                             @"eventId" : eventId,
                             @"messageId" : @(messageId),
                             @"errorCode" : @(errorCode),
                           }];
      };

  NSString *type = content[@"type"];
  if ([type isEqualToString:@"image"] || [type isEqualToString:@"file"]) {
    void (^progressBlock)(int progress, long messageId) = ^(int progress, long messageId) {
      [self sendEventWithName:@"rcimlib-send-message"
                         body:@{
                           @"type" : @"progress",
                           @"eventId" : eventId,
                           @"messageId" : @(messageId),
                           @"progress" : @(progress),
                         }];
    };

    void (^cancelBlock)(long messageId) = ^(long messageId) {
      [self sendEventWithName:@"rcimlib-send-message"
                         body:@{
                           @"type" : @"cancel",
                           @"eventId" : eventId,
                           @"messageId" : @(messageId),
                         }];
    };

    [RCIMClient.sharedRCIMClient sendMediaMessage:[message[@"conversationType"] intValue]
                                         targetId:message[@"targetId"]
                                          content:[self messageContentFromDictionary:content]
                                      pushContent:message[@"pushContent"]
                                         pushData:message[@"pushData"]
                                         progress:progressBlock
                                          success:successBlock
                                            error:errorBlock
                                           cancel:cancelBlock];
  } else {
    [RCIMClient.sharedRCIMClient sendMessage:[message[@"conversationType"] intValue]
                                    targetId:message[@"targetId"]
                                     content:[self messageContentFromDictionary:content]
                                 pushContent:message[@"pushContent"]
                                    pushData:message[@"pushData"]
                                     success:successBlock
                                       error:errorBlock];
  }
}

RCT_EXPORT_METHOD(getHistoryMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSString *)objectName
                  : (double)baseMessageId
                  : (int)count
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *messages;
  if (objectName && objectName.length > 0) {
    messages = [RCIMClient.sharedRCIMClient getHistoryMessages:conversationType
                                                      targetId:targetId
                                                    objectName:objectName
                                               oldestMessageId:baseMessageId
                                                         count:count];
  } else {
    messages = [RCIMClient.sharedRCIMClient getHistoryMessages:conversationType
                                                      targetId:targetId
                                               oldestMessageId:baseMessageId
                                                         count:count];
  }

  NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
  for (int i = 0; i < messages.count; i += 1) {
    array[i] = [self dictionaryFromMessage:messages[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(insertOutgoingMessage
                  : (int)conversationType
                  : (NSString *)targetId
                  : (int)sentStatus
                  : (NSDictionary *)content
                  : (double)sentTime
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message;
  if (sentTime) {
    message = [RCIMClient.sharedRCIMClient
        insertOutgoingMessage:conversationType
                     targetId:targetId
                   sentStatus:sentStatus
                      content:[self messageContentFromDictionary:content]
                     sentTime:sentTime];
  } else {
    message = [RCIMClient.sharedRCIMClient
        insertOutgoingMessage:conversationType
                     targetId:targetId
                   sentStatus:sentStatus
                      content:[self messageContentFromDictionary:content]];
  }
  resolve([self dictionaryFromMessage:message]);
}

RCT_EXPORT_METHOD(clearMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient clearMessages:conversationType targetId:targetId]));
}

RCT_EXPORT_METHOD(deleteMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient deleteMessages:conversationType
      targetId:targetId
      success:^{
        resolve(@(true));
      }
      error:^(RCErrorCode status) {
        reject(@"", @"", nil);
      }];
}

RCT_EXPORT_METHOD(deleteMessagesByIds
                  : (NSArray *)ids
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient deleteMessages:ids]));
}

- (void)onConnectionStatusChanged:(RCConnectionStatus)status {
  [self sendEventWithName:@"rcimlib-connection-status" body:@(status)];
}

- (void)onReceived:(RCMessage *)message left:(int)left object:(id)object {
  [self sendEventWithName:@"rcimlib-receive-message" body:[self dictionaryFromMessage:message]];
}

- (NSDictionary *)dictionaryFromMessage:(RCMessage *)message {
  return @{
    @"conversationType" : @(message.conversationType),
    @"objectName" : message.objectName,
    @"targetId" : message.targetId,
    @"messageUId" : message.messageUId ? message.messageUId : @"",
    @"messageId" : @(message.messageId),
    @"messageDirection" : @(message.messageDirection),
    @"senderUserId" : message.senderUserId,
    @"sentTime" : @(message.sentTime),
    @"receivedTime" : @(message.receivedTime),
    @"content" : [self dictionaryFromMessageContent:message.content],
    @"extra" : message.extra ? message.extra : @"",
  };
}

- (NSDictionary *)dictionaryFromMessageContent:(RCMessageContent *)content {
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
        @{@"type" : @"text", @"content" : text.content, @"extra" : text.extra ? text.extra : @""};
  } else if ([content isKindOfClass:[RCFileMessage class]]) {
    RCFileMessage *file = (RCFileMessage *)content;
    return @{
      @"type" : @"file",
      @"local" : file.localPath ? file.localPath : @"",
      @"remote" : file.remoteUrl ? file.remoteUrl : @"",
      @"name" : file.name,
      @"fileType" : file.type,
      @"size" : @(file.size),
      @"extra" : file.extra ? file.extra : @"",
    };
  }
  return nil;
}

- (RCMessageContent *)messageContentFromDictionary:(NSDictionary *)content {
  NSString *type = content[@"type"];
  if ([type isEqualToString:@"text"]) {
    RCTextMessage *text = [RCTextMessage messageWithContent:content[@"content"]];
    text.extra = content[@"extra"];
    return text;
  } else if ([type isEqualToString:@"image"]) {
    NSString *local = content[@"local"];
    RCImageMessage *image = [RCImageMessage
        messageWithImageURI:[local stringByReplacingOccurrencesOfString:@"file://" withString:@""]];
    image.extra = content[@"extra"];
    return image;
  } else if ([type isEqualToString:@"file"]) {
    NSString *local = content[@"local"];
    RCFileMessage *file = [RCFileMessage
        messageWithFile:[local stringByReplacingOccurrencesOfString:@"file://" withString:@""]];
    file.extra = content[@"extra"];
    return file;
  }
  return nil;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"rcimlib-connect", @"rcimlib-connection-status", @"rcimlib-receive-message",
    @"rcimlib-send-message"
  ];
}

@end
