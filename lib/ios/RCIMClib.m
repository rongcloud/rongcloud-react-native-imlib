#import "RCIMClib.h"
#import <React/RCTConvert.h>

@implementation RCIMClib {
}

RCT_EXPORT_MODULE(RCIMClient)

RCT_EXPORT_METHOD(init : (NSString *)key) {
  [RCIMClient.sharedRCIMClient initWithAppKey:key];
  [RCIMClient.sharedRCIMClient setRCConnectionStatusChangeDelegate:self];
  [RCIMClient.sharedRCIMClient setReceiveMessageDelegate:self object:nil];
  [RCIMClient.sharedRCIMClient setRCLogInfoDelegate:self];
  [RCIMClient.sharedRCIMClient setRCTypingStatusDelegate:self];
}

RCT_EXPORT_METHOD(setDeviceToken : (NSString *)token) {
  [RCIMClient.sharedRCIMClient setDeviceToken:token];
}

RCT_EXPORT_METHOD(setServerInfo : (NSString *)naviServer : (NSString *)fileServer) {
  [RCIMClient.sharedRCIMClient setServerInfo:naviServer fileServer:fileServer];
}

RCT_EXPORT_METHOD(setStatisticServer : (NSString *)server) {
  [RCIMClient.sharedRCIMClient setStatisticServer:server];
}

RCT_EXPORT_METHOD(setReconnectKickEnable : (BOOL)enabled) {
  [RCIMClient.sharedRCIMClient setReconnectKickEnable:enabled];
}

RCT_EXPORT_METHOD(getConnectionStatus
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient getConnectionStatus]));
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

RCT_EXPORT_METHOD(disconnect : (BOOL)isReceivePush) {
  [RCIMClient.sharedRCIMClient disconnect:isReceivePush];
}

RCT_EXPORT_METHOD(setMessageSentStatus
                  : (int)messageId
                  : (int)status
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient setMessageSentStatus:messageId sentStatus:status]));
}

RCT_EXPORT_METHOD(setMessageReceivedStatus
                  : (int)messageId
                  : (int)status
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient setMessageReceivedStatus:messageId
                                                   receivedStatus:status]));
}

RCT_EXPORT_METHOD(sendMessage : (NSDictionary *)message : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient sendMessage:[message[@"conversationType"] intValue]
      targetId:message[@"targetId"]
      content:[self toMessageContent:message[@"content"]]
      pushContent:message[@"pushContent"]
      pushData:message[@"pushData"]
      success:^(long messageId) {
        [self sendEventWithName:@"rcimlib-send-message"
                           body:@{
                             @"type" : @"success",
                             @"eventId" : eventId,
                             @"messageId" : @(messageId),
                           }];
      }
      error:^(RCErrorCode errorCode, long messageId) {
        [self sendMessageError:eventId errorCode:errorCode messageId:messageId];
      }];
}

RCT_EXPORT_METHOD(sendMediaMessage : (NSDictionary *)message : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient sendMediaMessage:[message[@"conversationType"] intValue]
      targetId:message[@"targetId"]
      content:[self toMessageContent:message[@"content"]]
      pushContent:message[@"pushContent"]
      pushData:message[@"pushData"]
      progress:^(int progress, long messageId) {
        [self sendEventWithName:@"rcimlib-send-message"
                           body:@{
                             @"type" : @"progress",
                             @"eventId" : eventId,
                             @"messageId" : @(messageId),
                             @"progress" : @(progress),
                           }];
      }
      success:^(long messageId) {
        [self sendEventWithName:@"rcimlib-send-message"
                           body:@{
                             @"type" : @"success",
                             @"eventId" : eventId,
                             @"messageId" : @(messageId),
                           }];
      }
      error:^(RCErrorCode errorCode, long messageId) {
        [self sendMessageError:eventId errorCode:errorCode messageId:messageId];
      }
      cancel:^(long messageId) {
        [self sendEventWithName:@"rcimlib-send-message"
                           body:@{
                             @"type" : @"cancel",
                             @"eventId" : eventId,
                             @"messageId" : @(messageId),
                           }];
      }];
}

RCT_EXPORT_METHOD(sendDirectionalMessage
                  : (NSDictionary *)message
                  : (NSArray *)userIdList
                  : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient sendDirectionalMessage:[message[@"conversationType"] intValue]
      targetId:message[@"targetId"]
      toUserIdList:userIdList
      content:[self toMessageContent:message[@"content"]]
      pushContent:message[@"pushContent"]
      pushData:message[@"pushData"]
      success:^(long messageId) {
        [self sendEventWithName:@"rcimlib-send-message"
                           body:@{
                             @"type" : @"cancel",
                             @"eventId" : eventId,
                             @"messageId" : @(messageId),
                           }];
      }
      error:^(RCErrorCode errorCode, long messageId) {
        [self sendMessageError:eventId errorCode:errorCode messageId:messageId];
      }];
}

- (void)sendMessageError:(NSString *)eventId
               errorCode:(RCErrorCode)errorCode
               messageId:(long)messageId {
  [self sendEventWithName:@"rcimlib-send-message"
                     body:@{
                       @"type" : @"error",
                       @"eventId" : eventId,
                       @"messageId" : @(messageId),
                       @"errorCode" : @(errorCode),
                     }];
}

RCT_EXPORT_METHOD(recallMessage
                  : (int)messageId
                  : (NSString *)pushContent
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message = [RCIMClient.sharedRCIMClient getMessage:messageId];
  [RCIMClient.sharedRCIMClient recallMessage:message
      pushContent:pushContent
      success:^(long messageId) {
        RCMessage *message = [RCIMClient.sharedRCIMClient getMessage:messageId];
        resolve([self fromMessageContent:message.content]);
      }
      error:^(RCErrorCode errorcode) {
        [self reject:reject error:errorcode];
      }];
}

RCT_EXPORT_METHOD(sendTypingStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSString *)typingContentType) {
  [RCIMClient.sharedRCIMClient sendTypingStatus:conversationType
                                       targetId:targetId
                                    contentType:typingContentType];
}

RCT_EXPORT_METHOD(sendReadReceiptMessage
                  : (int)conversationType
                  : (NSString *)targetId
                  : (double)timestamp) {
  [RCIMClient.sharedRCIMClient sendReadReceiptMessage:conversationType
      targetId:targetId
      time:timestamp
      success:^{
        NSLog(@"sendReadReceiptMessageSuccess");
      }
      error:^(RCErrorCode error) {
        NSLog(@"sendReadReceiptMessageError");
      }];
}

RCT_EXPORT_METHOD(sendReadReceiptRequest
                  : (int)messageId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message = [RCIMClient.sharedRCIMClient getMessage:messageId];
  [RCIMClient.sharedRCIMClient sendReadReceiptRequest:message
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode error) {
        [self reject:reject error:error];
      }];
}

RCT_EXPORT_METHOD(setOfflineMessageDuration
                  : (int)duration
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient setOfflineMessageDuration:duration
      success:^{
        resolve(nil);
      }
      failure:^(RCErrorCode error) {
        [self reject:reject error:error];
      }];
}

RCT_EXPORT_METHOD(getOfflineMessageDuration
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient getOfflineMessageDuration]));
}

RCT_EXPORT_METHOD(getHistoryMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSString *)objectName
                  : (double)baseMessageId
                  : (int)count
                  : (BOOL)isForward
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *messages;
  if (objectName && objectName.length > 0) {
    messages = [RCIMClient.sharedRCIMClient getHistoryMessages:conversationType
                                                      targetId:targetId
                                                    objectName:objectName
                                                 baseMessageId:baseMessageId
                                                     isForward:(BOOL)isForward
                                                         count:count];
  } else {
    messages = [RCIMClient.sharedRCIMClient getHistoryMessages:conversationType
                                                      targetId:targetId
                                               oldestMessageId:baseMessageId
                                                         count:count];
  }

  NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
  for (int i = 0; i < messages.count; i += 1) {
    array[i] = [self fromMessage:messages[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(getHistoryMessagesByTimestamp
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSArray<NSString *> *)objectNames
                  : (double)timestamp
                  : (int)count
                  : (BOOL)isForward
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *messages;
  if (objectNames && objectNames.count > 0) {
    messages = [RCIMClient.sharedRCIMClient getHistoryMessages:conversationType
                                                      targetId:targetId
                                                   objectNames:objectNames
                                                      sentTime:timestamp
                                                     isForward:isForward
                                                         count:count];
  } else {
    messages = [RCIMClient.sharedRCIMClient getHistoryMessages:conversationType
                                                      targetId:targetId
                                                      sentTime:timestamp
                                                   beforeCount:count
                                                    afterCount:0];
  }

  NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
  for (int i = 0; i < messages.count; i += 1) {
    array[i] = [self fromMessage:messages[i]];
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
    message = [RCIMClient.sharedRCIMClient insertOutgoingMessage:conversationType
                                                        targetId:targetId
                                                      sentStatus:sentStatus
                                                         content:[self toMessageContent:content]
                                                        sentTime:sentTime];
  } else {
    message = [RCIMClient.sharedRCIMClient insertOutgoingMessage:conversationType
                                                        targetId:targetId
                                                      sentStatus:sentStatus
                                                         content:[self toMessageContent:content]];
  }
  if (message) {
    resolve([self fromMessage:message]);
  } else {
    reject(@"", @"插入消息失败", nil);
  }
}

RCT_EXPORT_METHOD(insertIncomingMessage
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSString *)senderId
                  : (int)receiveStatus
                  : (NSDictionary *)content
                  : (double)sentTime
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message;
  if (sentTime) {
    message = [RCIMClient.sharedRCIMClient insertIncomingMessage:conversationType
                                                        targetId:targetId
                                                    senderUserId:senderId
                                                  receivedStatus:receiveStatus
                                                         content:[self toMessageContent:content]
                                                        sentTime:sentTime];
  } else {
    message = [RCIMClient.sharedRCIMClient insertIncomingMessage:conversationType
                                                        targetId:targetId
                                                    senderUserId:senderId
                                                  receivedStatus:receiveStatus
                                                         content:[self toMessageContent:content]];
  }
  if (message) {
    resolve([self fromMessage:message]);
  } else {
    reject(@"", @"插入消息失败", nil);
  }
}

RCT_EXPORT_METHOD(clearMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient clearMessages:conversationType targetId:targetId]));
}

RCT_EXPORT_METHOD(cancelSendMediaMessage
                  : (int)messageId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  BOOL isSuccess = [RCIMClient.sharedRCIMClient cancelSendMediaMessage:messageId];
  if (isSuccess) {
    resolve(nil);
  } else {
    reject(@"", @"取消失败", nil);
  }
}

RCT_EXPORT_METHOD(cancelDownloadMediaMessage
                  : (int)messageId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  BOOL isSuccess = [RCIMClient.sharedRCIMClient cancelDownloadMediaMessage:messageId];
  if (isSuccess) {
    resolve(nil);
  } else {
    reject(@"", @"取消失败", nil);
  }
}

RCT_EXPORT_METHOD(downloadMediaMessage : (int)messageId : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient downloadMediaMessage:messageId
      progress:^(int progress) {
        [self sendEventWithName:@"rcimlib-download-media-message"
                           body:@{
                             @"type" : @"progress",
                             @"progress" : @(progress),
                           }];
      }
      success:^(NSString *mediaPath) {
        [self sendEventWithName:@"rcimlib-download-media-message"
                           body:@{
                             @"type" : @"cancel",
                             @"path" : mediaPath,
                           }];
      }
      error:^(RCErrorCode errorCode) {
        [self sendEventWithName:@"rcimlib-download-media-message"
                           body:@{
                             @"type" : @"error",
                             @"errorCode" : @(errorCode),
                           }];
      }
      cancel:^{
        [self sendEventWithName:@"rcimlib-download-media-message"
                           body:@{
                             @"type" : @"cancel",
                             @"eventId" : eventId,
                           }];
      }];
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
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getRemoteHistoryMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (double)time
                  : (double)count
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient getRemoteHistoryMessages:conversationType
      targetId:targetId
      recordTime:time
      count:count
      success:^(NSArray *messages, BOOL isRemaining) {
        NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
        for (int i = 0; i < messages.count; i += 1) {
          array[i] = [self fromMessage:messages[i]];
        }
        resolve(array);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(cleanRemoteHistoryMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (double)time
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient clearRemoteHistoryMessages:conversationType
      targetId:targetId
      recordTime:time
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(cleanHistoryMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (double)time
                  : (BOOL)cleanRemote
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient clearHistoryMessages:conversationType
      targetId:targetId
      recordTime:time
      clearRemote:cleanRemote
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(deleteMessagesByIds
                  : (NSArray *)ids
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient deleteMessages:ids]));
}

RCT_EXPORT_METHOD(searchConversations
                  : (NSString *)keyword
                  : (NSArray<NSNumber *> *)conversationTypes
                  : (NSArray<NSString *> *)messageTypes
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray<RCSearchConversationResult *> *results =
      [RCIMClient.sharedRCIMClient searchConversations:conversationTypes
                                           messageType:messageTypes
                                               keyword:keyword];
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:results.count];
  for (int i = 0; i < results.count; i += 1) {
    array[i] = @{
      @"matchCount" : @(results[i].matchCount),
      @"conversation" : [self fromConversation:results[i].conversation]
    };
  }
  resolve(array);
}

RCT_EXPORT_METHOD(searchMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSString *)keyword
                  : (int)count
                  : (double)startTime
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *messages = [RCIMClient.sharedRCIMClient searchMessages:conversationType
                                                         targetId:targetId
                                                          keyword:keyword
                                                            count:count
                                                        startTime:startTime];
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
  for (int i = 0; i < messages.count; i += 1) {
    array[i] = [self fromMessage:messages[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(getMessage
                  : (int)messageId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message = [RCIMClient.sharedRCIMClient getMessage:messageId];
  if (message) {
    resolve([self fromMessage:message]);
  } else {
    reject(@"", @"消息不存在", nil);
  }
}

RCT_EXPORT_METHOD(getMessageByUId
                  : (NSString *)UId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message = [RCIMClient.sharedRCIMClient getMessageByUId:UId];
  if (message) {
    resolve([self fromMessage:message]);
  } else {
    reject(@"", @"消息不存在", nil);
  }
}

RCT_EXPORT_METHOD(setMessageExtra
                  : (int)messageId
                  : (NSString *)extra
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient setMessageExtra:messageId value:extra]));
}

RCT_EXPORT_METHOD(getMessageSendTime
                  : (int)messageId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient getMessageSendTime:messageId]));
}

RCT_EXPORT_METHOD(getMessageCount
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient getMessageCount:conversationType targetId:targetId]));
}

RCT_EXPORT_METHOD(getFirstUnreadMessage
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message = [RCIMClient.sharedRCIMClient getFirstUnreadMessage:conversationType
                                                                 targetId:targetId];
  if (message) {
    resolve([self fromMessage:message]);
  } else {
    reject(@"", @"获取失败", nil);
  }
}

RCT_EXPORT_METHOD(getUnreadMentionedMessages
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *messages = [RCIMClient.sharedRCIMClient getUnreadMentionedMessages:conversationType
                                                                     targetId:targetId];
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
  for (int i = 0; i < messages.count; i += 1) {
    array[i] = [self fromMessage:messages[i]];
  }
  resolve(messages);
}

RCT_EXPORT_METHOD(sendReadReceiptResponse
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSArray *)messages
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
  for (int i = 0; i < messages.count; i += 1) {
    array[i] = [self fromMessage:messages[i]];
  }
  [RCIMClient.sharedRCIMClient sendReadReceiptResponse:conversationType
      targetId:targetId
      messageList:array
      success:^{
        resolve(resolve);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getConversation
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCConversation *conversation = [RCIMClient.sharedRCIMClient getConversation:conversationType
                                                                     targetId:targetId];
  if (conversation) {
    resolve([self fromConversation:conversation]);
  } else {
    resolve(nil);
  }
}

RCT_EXPORT_METHOD(removeConversation
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient removeConversation:conversationType targetId:targetId]));
}

RCT_EXPORT_METHOD(getConversationList
                  : (NSArray<NSNumber *> *)conversationTypes
                  : (int)count
                  : (double)timestamp
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *list;
  if (count) {
    list = [RCIMClient.sharedRCIMClient getConversationList:conversationTypes
                                                      count:count
                                                  startTime:timestamp];
  } else {
    list = [RCIMClient.sharedRCIMClient getConversationList:conversationTypes];
  }
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:list.count];
  for (int i = 0; i < list.count; i += 1) {
    array[i] = [self fromConversation:list[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(getBlockedConversationList
                  : (NSArray<NSNumber *> *)conversationTypes
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *list = [RCIMClient.sharedRCIMClient getBlockedConversationList:conversationTypes];
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:list.count];
  for (int i = 0; i < list.count; i += 1) {
    array[i] = [self fromConversation:list[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(setConversationToTop
                  : (int)conversationType
                  : (NSString *)targetId
                  : (BOOL)isTop
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient setConversationToTop:conversationType
                                                     targetId:targetId
                                                        isTop:isTop]));
}

RCT_EXPORT_METHOD(getTopConversationList
                  : (NSArray<NSNumber *> *)conversationTypes
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *list = [RCIMClient.sharedRCIMClient getTopConversationList:conversationTypes];
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:list.count];
  for (int i = 0; i < list.count; i += 1) {
    array[i] = [self fromConversation:list[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(setConversationNotificationStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (BOOL)isBlock
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient setConversationNotificationStatus:conversationType
      targetId:targetId
      isBlocked:isBlock
      success:^(RCConversationNotificationStatus status) {
        resolve(@(status));
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getConversationNotificationStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient getConversationNotificationStatus:conversationType
      targetId:targetId
      success:^(RCConversationNotificationStatus status) {
        resolve(@(!status));
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(setNotificationQuietHours
                  : (NSString *)startTime
                  : (int)span
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient setNotificationQuietHours:startTime
      spanMins:span
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getNotificationQuietHours
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient
      getNotificationQuietHours:^(NSString *startTime, int spansMin) {
        resolve(@{@"startTime" : startTime, @"spanMinutes" : @(spansMin)});
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(removeNotificationQuietHours
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient
      removeNotificationQuietHours:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(syncConversationReadStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (double)timestamp
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient syncConversationReadStatus:conversationType
      targetId:targetId
      time:timestamp
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(saveTextMessageDraft
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSString *)content
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient saveTextMessageDraft:conversationType
                                                     targetId:targetId
                                                      content:content]));
}

RCT_EXPORT_METHOD(getTextMessageDraft
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve([RCIMClient.sharedRCIMClient getTextMessageDraft:conversationType targetId:targetId]);
}

RCT_EXPORT_METHOD(clearTextMessageDraft
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  BOOL isSuccess = [RCIMClient.sharedRCIMClient clearTextMessageDraft:conversationType
                                                             targetId:targetId];
  if (isSuccess) {
    resolve(nil);
  } else {
    reject(@"", @"清除文本消息草稿失败", nil);
  }
}

RCT_EXPORT_METHOD(getTotalUnreadCount
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(@([RCIMClient.sharedRCIMClient getTotalUnreadCount]));
}

RCT_EXPORT_METHOD(getUnreadCount
                  : (int)conversationType
                  : (NSString *)targetId
                  : (NSArray<NSNumber *> *)conversationTypes
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  if (conversationType == 0) {
    resolve(@([RCIMClient.sharedRCIMClient getUnreadCount:conversationTypes]));
  } else {
    resolve(@([RCIMClient.sharedRCIMClient getUnreadCount:conversationType targetId:targetId]));
  }
}

RCT_EXPORT_METHOD(clearMessagesUnreadStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (double)time
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  if (time == 0) {
    resolve(@([RCIMClient.sharedRCIMClient clearMessagesUnreadStatus:conversationType
                                                            targetId:targetId]));
  } else {
    resolve(@([RCIMClient.sharedRCIMClient clearMessagesUnreadStatus:conversationType
                                                            targetId:targetId
                                                                time:time]));
  }
}

RCT_EXPORT_METHOD(addToBlacklist
                  : (NSString *)userId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient addToBlacklist:userId
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(removeFromBlacklist
                  : (NSString *)userId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient removeFromBlacklist:userId
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getBlacklistStatus
                  : (NSString *)userId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient getBlacklistStatus:userId
      success:^(int status) {
        resolve(@(status == 0));
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getBlacklist : (RCTPromiseResolveBlock)resolve : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient
      getBlacklist:^(NSArray *ids) {
        resolve(ids);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(joinChatRoom
                  : (NSString *)targetId
                  : (int)messageCount
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient joinChatRoom:targetId
      messageCount:messageCount
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(joinExistChatRoom
                  : (NSString *)targetId
                  : (int)messageCount
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient joinExistChatRoom:targetId
      messageCount:messageCount
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(quitChatRoom
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient quitChatRoom:targetId
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getChatRoomInfo
                  : (NSString *)targetId
                  : (int)count
                  : (int)order
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient getChatRoomInfo:targetId
      count:count
      order:order
      success:^(RCChatRoomInfo *chatRoomInfo) {
        resolve([self fromChatRoomInfo:chatRoomInfo]);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getRemoteChatRoomHistoryMessages
                  : (NSString *)targetId
                  : (double)recordTime
                  : (double)count
                  : (double)order
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient getRemoteChatroomHistoryMessages:targetId
      recordTime:recordTime
      count:count
      order:order
      success:^(NSArray *messages, long long syncTime) {
        NSMutableArray *array = [NSMutableArray arrayWithCapacity:messages.count];
        for (int i = 0; i < messages.count; i += 1) {
          array[i] = [self fromMessage:messages[i]];
        }
        resolve(@{@"messages" : array, @"syncTime" : @(syncTime)});
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(createDiscussion
                  : (NSString *)name
                  : (NSArray<NSString *> *)userList
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient createDiscussion:name
      userIdList:userList
      success:^(RCDiscussion *discussion) {
        resolve(discussion.discussionId);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(getDiscussion
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient getDiscussion:targetId
      success:^(RCDiscussion *discussion) {
        resolve([self fromDiscussion:discussion]);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(quitDiscussion
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient quitChatRoom:targetId
      success:^(void) {
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(addMemberToDiscussion
                  : (NSString *)targetId
                  : (NSArray<NSString *> *)userList
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient addMemberToDiscussion:targetId
      userIdList:userList
      success:^(RCDiscussion *discussion) {
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(removeMemberFromDiscussion
                  : (NSString *)targetId
                  : (NSString *)userId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient removeMemberFromDiscussion:targetId
      userId:userId
      success:^(RCDiscussion *discussion) {
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(setDiscussionName
                  : (NSString *)targetId
                  : (NSString *)name
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient setDiscussionName:targetId
      name:name
      success:^(void) {
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(setDiscussionInviteStatus
                  : (NSString *)targetId
                  : (BOOL)isOpen
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient setDiscussionInviteStatus:targetId
      isOpen:isOpen
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(searchPublicService
                  : (NSString *)keyword
                  : (int)searchType
                  : (int)publicServiceType
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  if (publicServiceType) {
    [RCIMClient.sharedRCIMClient searchPublicServiceByType:publicServiceType
        searchType:searchType
        searchKey:keyword
        success:^(NSArray *accounts) {
          resolve([self fromPublicServiceProfileArray:accounts]);
        }
        error:^(RCErrorCode status) {
          [self reject:reject error:status];
        }];
  } else {
    [RCIMClient.sharedRCIMClient searchPublicService:searchType
        searchKey:keyword
        success:^(NSArray *accounts) {
          resolve([self fromPublicServiceProfileArray:accounts]);
        }
        error:^(RCErrorCode status) {
          [self reject:reject error:status];
        }];
  }
}

RCT_EXPORT_METHOD(getPublicServiceProfile
                  : (int)type
                  : (NSString *)id
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve([self fromPublicServiceProfile:[RCIMClient.sharedRCIMClient getPublicServiceProfile:type
                                                                              publicServiceId:id]]);
}

RCT_EXPORT_METHOD(getPublicServiceList
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve([self fromPublicServiceProfileArray:[RCIMClient.sharedRCIMClient getPublicServiceList]]);
}

RCT_EXPORT_METHOD(subscribePublicService
                  : (int)type
                  : (NSString *)id
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient subscribePublicService:type
      publicServiceId:id
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(unsubscribePublicService
                  : (int)type
                  : (NSString *)id
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient unsubscribePublicService:type
      publicServiceId:id
      success:^{
        resolve(nil);
      }
      error:^(RCErrorCode status) {
        [self reject:reject error:status];
      }];
}

RCT_EXPORT_METHOD(startRealTimeLocation
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCRealTimeLocationManager.sharedManager getRealTimeLocationProxy:conversationType
      targetId:targetId
      success:^(id<RCRealTimeLocationProxy> locationShare) {
        [locationShare startRealTimeLocation];
        resolve(nil);
      }
      error:^(RCRealTimeLocationErrorCode status) {
        reject([@(status) stringValue], @"", nil);
      }];
}

RCT_EXPORT_METHOD(joinRealTimeLocation
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCRealTimeLocationManager.sharedManager getRealTimeLocationProxy:conversationType
      targetId:targetId
      success:^(id<RCRealTimeLocationProxy> locationShare) {
        [locationShare joinRealTimeLocation];
        resolve(nil);
      }
      error:^(RCRealTimeLocationErrorCode status) {
        reject([@(status) stringValue], @"", nil);
      }];
}

RCT_EXPORT_METHOD(quitRealTimeLocation
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCRealTimeLocationManager.sharedManager getRealTimeLocationProxy:conversationType
      targetId:targetId
      success:^(id<RCRealTimeLocationProxy> locationShare) {
        [locationShare quitRealTimeLocation];
        resolve(nil);
      }
      error:^(RCRealTimeLocationErrorCode status) {
        reject([@(status) stringValue], @"", nil);
      }];
}

RCT_EXPORT_METHOD(getRealTimeLocationParticipants
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCRealTimeLocationManager.sharedManager getRealTimeLocationProxy:conversationType
      targetId:targetId
      success:^(id<RCRealTimeLocationProxy> locationShare) {
        resolve([locationShare getParticipants]);
      }
      error:^(RCRealTimeLocationErrorCode status) {
        reject([@(status) stringValue], @"", nil);
      }];
}

RCT_EXPORT_METHOD(getRealTimeLocationStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCRealTimeLocationManager.sharedManager getRealTimeLocationProxy:conversationType
      targetId:targetId
      success:^(id<RCRealTimeLocationProxy> locationShare) {
        resolve(@([locationShare getStatus]));
      }
      error:^(RCRealTimeLocationErrorCode status) {
        reject([@(status) stringValue], @"", nil);
      }];
}

RCT_EXPORT_METHOD(startCustomerService
                  : (NSString *)kefuId
                  : (RCCustomerServiceInfo *)info
                  : (NSString *)eventId) {
  [RCIMClient.sharedRCIMClient startCustomerService:kefuId
      info:info
      onSuccess:^(RCCustomerServiceConfig *config) {
        NSMutableArray *leaveMessageNativeInfo =
            [[NSMutableArray alloc] initWithCapacity:config.leaveMessageNativeInfo.count];
        for (int i = 0; i < config.leaveMessageNativeInfo.count; i += 1) {
          leaveMessageNativeInfo[i] = @{
            @"name" : config.leaveMessageNativeInfo[i].name,
            @"title" : config.leaveMessageNativeInfo[i].title,
            @"type" : config.leaveMessageNativeInfo[i].type,
            @"defaultText" : config.leaveMessageNativeInfo[i].defaultText,
            @"required" : @(config.leaveMessageNativeInfo[i].required),
            @"message" : config.leaveMessageNativeInfo[i].message,
            @"verification" : config.leaveMessageNativeInfo[i].verification,
            @"max" : @(config.leaveMessageNativeInfo[i].max),
          };
        }
        NSMutableArray *humanEvaluateItems =
            [[NSMutableArray alloc] initWithCapacity:config.humanEvaluateItems.count];
        for (int i = 0; i < config.humanEvaluateItems.count; i += 1) {
          humanEvaluateItems[i] = @{
            @"value" : @(((RCEvaluateItem *)config.humanEvaluateItems[i]).value),
            @"description" : ((RCEvaluateItem *)config.humanEvaluateItems[i]).describe,
          };
        }
        [self
            sendEventWithName:@"rcimlib-customer-service"
                         body:@{
                           @"eventId" : eventId,
                           @"type" : @"success",
                           @"config" : @{
                             @"companyName" : config.companyName ? config.companyName : @"",
                             @"companyUrl" : config.companyUrl ? config.companyUrl : @"",
                             @"isBlack" : @(config.isBlack),
                             @"announceMsg" : config.announceMsg ? config.announceMsg : @"",
                             @"announceClickUrl" : config.announceClickUrl ? config.announceClickUrl
                                                                           : @"",
                             @"leaveMessageType" : @(config.leaveMessageType),
                             @"leaveMessageNativeInfo" : leaveMessageNativeInfo,
                             @"userTipTime" : @(config.userTipTime),
                             @"userTipWord" : config.userTipWord ? config.userTipWord : @"",
                             @"adminTipTime" : @(config.adminTipTime),
                             @"adminTipWord" : config.adminTipWord ? config.adminTipWord : @"",
                             @"evaType" : @(config.evaType),
                             @"evaEntryPoint" : @(config.evaEntryPoint),
                             @"robotSessionNoEva" : @(config.robotSessionNoEva),
                             @"isReportResolveStatus" : @(config.reportResolveStatus),
                             @"isDisableLocation" : @(config.disableLocation),
                             @"humanEvaluateItems" : humanEvaluateItems,
                           },
                         }];
      }
      onError:^(int errorCode, NSString *errMsg) {
        [self sendEventWithName:@"rcimlib-customer-service"
                           body:@{
                             @"eventId" : eventId,
                             @"type" : @"error",
                             @"errorCode" : @(errorCode),
                             @"errorMessage" : errMsg
                           }];
      }
      onModeType:^(RCCSModeType mode) {
        [self sendEventWithName:@"rcimlib-customer-service"
                           body:@{
                             @"eventId" : eventId,
                             @"type" : @"mode-changed",
                             @"mode" : @(mode),
                           }];
      }
      onPullEvaluation:^(NSString *dialogId) {
        [self sendEventWithName:@"rcimlib-customer-service"
                           body:@{
                             @"eventId" : eventId,
                             @"type" : @"pull-evaluation",
                             @"dialogId" : dialogId,
                           }];
      }
      onSelectGroup:^(NSArray<RCCustomerServiceGroupItem *> *groupList) {
        NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:groupList.count];
        for (int i = 0; i < groupList.count; i += 1) {
          array[i] = @{
            @"id" : groupList[i].groupId,
            @"name" : groupList[i].name,
            @"isOnline" : @(groupList[i].online)
          };
        }
        [self sendEventWithName:@"rcimlib-customer-service"
                           body:@{
                             @"eventId" : eventId,
                             @"type" : @"quit",
                             @"groups" : array,
                           }];
      }
      onQuit:^(NSString *quitMsg) {
        [self sendEventWithName:@"rcimlib-customer-service"
                           body:@{
                             @"eventId" : eventId,
                             @"type" : @"quit",
                             @"message" : quitMsg,
                           }];
      }];
}

RCT_EXPORT_METHOD(switchToHumanMode : (NSString *)kefuId) {
  [RCIMClient.sharedRCIMClient switchToHumanMode:kefuId];
}

RCT_EXPORT_METHOD(leaveMessageCustomerService
                  : (NSString *)kefuId
                  : (NSDictionary *)message
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient leaveMessageCustomerService:kefuId
      leaveMessageDic:message
      success:^{
        resolve(nil);
      }
      failure:^{
        reject(@"", @"", nil);
      }];
}

RCT_EXPORT_METHOD(evaluateCustomerService
                  : (NSString *)kefuId
                  : (NSString *)dialogId
                  : (int)value
                  : (NSString *)suggest
                  : (int)status
                  : (NSString *)tagText
                  : (NSString *)extra) {
  if (tagText) {
    [RCIMClient.sharedRCIMClient evaluateCustomerService:kefuId
                                                dialogId:dialogId
                                               starValue:value
                                                 suggest:suggest
                                           resolveStatus:status
                                                 tagText:tagText
                                                   extra:nil];
  } else {
    [RCIMClient.sharedRCIMClient evaluateCustomerService:kefuId
                                                dialogId:dialogId
                                               starValue:value
                                                 suggest:suggest
                                           resolveStatus:status];
  }
}

RCT_EXPORT_METHOD(stopCustomerService : (NSString *)kefuId) {
  [RCIMClient.sharedRCIMClient stopCustomerService:kefuId];
}

RCT_EXPORT_METHOD(selectCustomerServiceGroup : (NSString *)kefuId : (NSString *)groupId) {
  [RCIMClient.sharedRCIMClient selectCustomerServiceGroup:kefuId withGroupId:groupId];
}

RCT_EXPORT_METHOD(getCurrentUserId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  resolve(RCIMClient.sharedRCIMClient.currentUserInfo.userId);
}

- (void)onConnectionStatusChanged:(RCConnectionStatus)status {
  [self sendEventWithName:@"rcimlib-connection-status" body:@(status)];
}

- (void)onReceived:(RCMessage *)message left:(int)left object:(id)object {
  [self sendEventWithName:@"rcimlib-receive-message"
                     body:@{@"message" : [self fromMessage:message], @"left" : @(left)}];
}

- (void)onTypingStatusChanged:(RCConversationType)conversationType
                     targetId:(NSString *)targetId
                       status:(NSArray *)status {
  if (status.count > 0) {
    RCUserTypingStatus *item = status[0];
    [self sendEventWithName:@"rcimlib-typing-status"
                       body:@{
                         @"conversationType" : @(conversationType),
                         @"targetId" : targetId,
                         @"userId" : item.userId,
                         @"typingContentType" : item.contentType,
                       }];
  } else {
    [self sendEventWithName:@"rcimlib-typing-status"
                       body:@{
                         @"conversationType" : @(conversationType),
                         @"targetId" : targetId,
                       }];
  }
}

- (void)didOccurLog:(NSString *)logInfo {
  [self sendEventWithName:@"rcimlib-log" body:logInfo];
}

- (void)onMessageReceiptRequest:(RCConversationType)conversationType
                       targetId:(NSString *)targetId
                     messageUId:(NSString *)messageUId {
  [self sendEventWithName:@"rcimlib-receipt-request"
                     body:@{
                       @"conversationType" : @(conversationType),
                       @"targetId" : targetId,
                       @"messageUId" : messageUId,
                     }];
}

- (void)onMessageRecalled:(long)messageId {
  [self sendEventWithName:@"rcimlib-recall" body:@(messageId)];
}

- (void)onMessageReceiptResponse:(RCConversationType)conversationType
                        targetId:(NSString *)targetId
                      messageUId:(NSString *)messageUId
                      readerList:(NSMutableDictionary *)userIdList {
  [self sendEventWithName:@"rcimlib-receipt-response"
                     body:@{
                       @"conversationType" : @(conversationType),
                       @"targetId" : targetId,
                       @"messageUId" : messageUId,
                       @"users" : userIdList,
                     }];
}

- (NSArray *)fromPublicServiceProfileArray:(NSArray<RCPublicServiceProfile *> *)items {
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:items.count];
  for (int i = 0; i < items.count; i += 1) {
    array[i] = [self fromPublicServiceProfile:items[i]];
  }
  return array;
}

- (NSDictionary *)fromPublicServiceProfile:(RCPublicServiceProfile *)profile {
  if (!profile) {
    return nil;
  }
  if (profile.menu) {
    return @{
      @"id" : profile.publicServiceId,
      @"name" : profile.name,
      @"introduction" : profile.introduction,
      @"portraitUrl" : profile.portraitUrl,
      @"isGlobal" : @(profile.isGlobal),
      @"followed" : @(profile.followed),
      @"type" : @(profile.publicServiceType),
      @"menu" : profile.menu.menuItems,
    };
  } else {
    return @{
      @"id" : profile.publicServiceId,
      @"name" : profile.name,
      @"introduction" : profile.introduction,
      @"portraitUrl" : profile.portraitUrl,
      @"isGlobal" : @(profile.isGlobal),
      @"followed" : @(profile.followed),
      @"type" : @(profile.publicServiceType),
    };
  }
}

- (NSArray *)fromPublicServiceMenuItems:(NSArray<RCPublicServiceMenuItem *> *)items {
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:items.count];
  for (int i = 0; i < items.count; i += 1) {
    array[i] = [self fromPublicServiceMenuItem:items[i]];
  }
  return array;
}

- (NSDictionary *)fromPublicServiceMenuItem:(RCPublicServiceMenuItem *)menu {
  if (menu.subMenuItems && menu.subMenuItems.count > 0) {
    return @{
      @"id" : menu.id,
      @"name" : menu.name,
      @"url" : menu.url,
      @"type" : @(menu.type),
      @"submenu" : [self fromPublicServiceMenuItems:menu.subMenuItems],
    };
  } else {
    return @{
      @"id" : menu.id,
      @"name" : menu.name,
      @"url" : menu.url,
      @"type" : @(menu.type),
    };
  }
}

- (void)reject:(RCTPromiseRejectBlock)reject error:(RCErrorCode)error {
  reject([@(error) stringValue], @"", nil);
}

- (NSDictionary *)fromDiscussion:(RCDiscussion *)discussion {
  return @{
    @"id" : discussion.discussionId,
    @"name" : discussion.discussionName,
    @"creatorId" : discussion.creatorId,
    @"isOpen" : @((BOOL)(discussion.inviteStatus == 0)),
    @"memberIdList" : discussion.memberIdList,
  };
}

- (NSArray *)fromMemberInfoArray:(NSArray<RCChatRoomMemberInfo *> *)list {
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:list.count];
  for (int i = 0; i < list.count; i += 1) {
    array[i] = @{
      @"userId" : list[i].userId,
      @"joinTime" : @(list[i].joinTime),
    };
  }
  return array;
}

- (NSDictionary *)fromChatRoomInfo:(RCChatRoomInfo *)chatRoomInfo {
  return @{
    @"targetId" : chatRoomInfo.targetId,
    @"memberOrder" : @(chatRoomInfo.memberOrder),
    @"totalMemberCount" : @(chatRoomInfo.totalMemberCount),
    @"members" : [self fromMemberInfoArray:chatRoomInfo.memberInfoArray],
  };
}

- (NSDictionary *)fromConversation:(RCConversation *)conversation {
  return @{
    @"conversationType" : @(conversation.conversationType),
    @"conversationTitle" : conversation.conversationTitle,
    @"isTop" : @(conversation.isTop),
    @"unreadMessageCount" : @(conversation.unreadMessageCount),
    @"draft" : conversation.draft,
    @"targetId" : conversation.targetId,
    @"objectName" : conversation.objectName,
    @"latestMessageId" : @(conversation.lastestMessageId),
    @"latestMessage" : [self fromMessageContent:conversation.lastestMessage],
    @"receivedStatus" : @(conversation.receivedStatus),
    @"receivedTime" : @(conversation.receivedTime),
    @"sentTime" : @(conversation.sentTime),
    @"sentStatus" : @(conversation.sentStatus),
    @"senderUserId" : conversation.senderUserId,
    @"hasUnreadMentioned" : @(conversation.hasUnreadMentioned),
  };
}

- (NSDictionary *)fromMessage:(RCMessage *)message {
  return @{
    @"conversationType" : @(message.conversationType),
    @"objectName" : message.objectName,
    @"targetId" : message.targetId,
    @"messageUId" : message.messageUId ? message.messageUId : @"",
    @"messageId" : @(message.messageId),
    @"messageDirection" : @(message.messageDirection),
    @"senderUserId" : message.senderUserId,
    @"sentTime" : @(message.sentTime),
    @"sentStatus" : @(message.sentStatus),
    @"receivedStatus" : @(message.receivedStatus),
    @"receivedTime" : @(message.receivedTime),
    @"content" : [self fromMessageContent:message.content],
    @"extra" : message.extra ? message.extra : @"",
  };
}

- (NSDictionary *)fromMessageContent:(RCMessageContent *)content {
  if ([content isKindOfClass:[RCImageMessage class]]) {
    RCImageMessage *image = (RCImageMessage *)content;
    return @{
      @"objectName" : @"RC:ImgMsg",
      @"local" : image.localPath ? image.localPath : @"",
      @"remote" : image.remoteUrl ? image.remoteUrl : @"",
      @"isFull" : @(image.isFull),
      @"extra" : image.extra ? image.extra : @""
    };
  } else if ([content isKindOfClass:[RCTextMessage class]]) {
    RCTextMessage *text = (RCTextMessage *)content;
    return @{
      @"objectName" : @"RC:TxtMsg",
      @"content" : text.content,
      @"extra" : text.extra ? text.extra : @""
    };
  } else if ([content isKindOfClass:[RCFileMessage class]]) {
    RCFileMessage *file = (RCFileMessage *)content;
    return @{
      @"objectName" : @"RC:FileMsg",
      @"local" : file.localPath ? file.localPath : @"",
      @"remote" : file.remoteUrl ? file.remoteUrl : @"",
      @"name" : file.name,
      @"fileType" : file.type,
      @"size" : @(file.size),
      @"extra" : file.extra ? file.extra : @"",
    };
  } else if ([content isKindOfClass:[RCDiscussionNotificationMessage class]]) {
    RCDiscussionNotificationMessage *message = (RCDiscussionNotificationMessage *)content;
    return @{
      @"objectName" : @"RC:DizNtf",
      @"notificationType" : @(message.type),
      @"operatorId" : message.operatorId,
      @"extension" : message.extension,
    };
  } else if ([content isKindOfClass:[RCLocationMessage class]]) {
    RCLocationMessage *message = (RCLocationMessage *)content;
    return @{
      @"objectName" : @"RC:LBSMsg",
      @"latitude" : @(message.location.latitude),
      @"longitude" : @(message.location.longitude),
      @"name" : message.locationName,
      @"thumbnail" : @"",
      @"extra" : message.extra ? message.extra : @"",
    };
  } else if ([content isKindOfClass:[RCVoiceMessage class]]) {
    RCVoiceMessage *message = (RCVoiceMessage *)content;
    NSString *data = @"";
    if (message.wavAudioData) {
      data = [message.wavAudioData base64EncodedStringWithOptions:0];
    }
    return @{
      @"objectName" : @"RC:VcMsg",
      @"data" : data,
      @"duration" : @(message.duration),
      @"extra" : message.extra ? message.extra : @"",
    };
  } else if ([content isKindOfClass:[RCRecallNotificationMessage class]]) {
    RCRecallNotificationMessage *message = (RCRecallNotificationMessage *)content;
    return @{
      @"objectName" : @"RC:RcNtf",
      @"operatorId" : message.operatorId,
      @"recallTime" : @(message.recallTime),
      @"originalObjectName" : message.originalObjectName ? message.originalObjectName : @"",
      @"isAdmin" : @(message.isAdmin),
    };
  } else if ([content isKindOfClass:[RCContactNotificationMessage class]]) {
    RCContactNotificationMessage *message = (RCContactNotificationMessage *)content;
    return @{
      @"objectName" : @"RC:ContactNtf",
      @"sourceUserId" : message.sourceUserId,
      @"targetUserId" : message.targetUserId,
      @"message" : message.message,
      @"operation" : message.operation,
      @"extra" : message.extra ? message.extra : @""
    };
  } else if ([content isKindOfClass:[RCCommandNotificationMessage class]]) {
    RCCommandNotificationMessage *message = (RCCommandNotificationMessage *)content;
    return @{@"objectName" : @"RC:CmdNtf", @"name" : message.name, @"data" : message.data};
  } else if ([content isKindOfClass:[RCProfileNotificationMessage class]]) {
    RCProfileNotificationMessage *message = (RCProfileNotificationMessage *)content;
    return @{
      @"objectName" : @"RC:ProfileNtf",
      @"operation" : message.operation,
      @"data" : message.data,
      @"extra" : message.extra ? message.extra : @""
    };
  } else if ([content isKindOfClass:[RCInformationNotificationMessage class]]) {
    RCInformationNotificationMessage *message = (RCInformationNotificationMessage *)content;
    return @{
      @"objectName" : @"RC:InfoNtf",
      @"message" : message.message,
      @"extra" : message.extra ? message.extra : @""
    };
  } else if ([content isKindOfClass:[RCGroupNotificationMessage class]]) {
    RCGroupNotificationMessage *message = (RCGroupNotificationMessage *)content;
    return @{
      @"objectName" : @"RC:GrpNtf",
      @"operation" : message.operation,
      @"operatorUserId" : message.operatorUserId,
      @"message" : message.message,
      @"data" : message.data,
      @"extra" : message.extra ? message.extra : @""
    };
  } else if ([content isKindOfClass:[RCPublicServiceCommandMessage class]]) {
    RCPublicServiceCommandMessage *message = (RCPublicServiceCommandMessage *)content;
    return @{@"objectName" : @"RC:PSCmd", @"extra" : message.extra ? message.extra : @""};
  } else if ([content isKindOfClass:[RCHQVoiceMessage class]]) {
    RCHQVoiceMessage *message = (RCHQVoiceMessage *)content;
    return @{
      @"objectName" : @"RC:HQVCMsg",
      @"local" : message.localPath,
      @"remote" : message.remoteUrl,
      @"duration" : @(message.duration),
      @"extra" : message.extra ? message.extra : @"",
    };
  } else if ([content isKindOfClass:[RCGIFMessage class]]) {
    RCGIFMessage *message = (RCGIFMessage *)content;
    return @{
      @"objectName" : @"RC:GIFMsg",
      @"local" : message.localPath,
      @"remote" : message.remoteUrl,
      @"width" : @(message.width),
      @"height" : @(message.height),
      @"gifDataSize" : @(message.gifDataSize),
      @"extra" : message.extra ? message.extra : @"",
    };
  }

  return @{@"error" : @"Content type not yet supported"};
}

- (RCMessageContent *)toMessageContent:(NSDictionary *)content {
  NSString *objectName = content[@"objectName"];
  RCMessageContent *messageContent;

  if ([objectName isEqualToString:@"RC:TxtMsg"]) {
    RCTextMessage *text = [RCTextMessage messageWithContent:content[@"content"]];
    text.extra = content[@"extra"];
    messageContent = text;
  } else if ([objectName isEqualToString:@"RC:ImgMsg"]) {
    NSString *local = content[@"local"];
    RCImageMessage *image = [RCImageMessage
        messageWithImageURI:[local stringByReplacingOccurrencesOfString:@"file://" withString:@""]];
    image.extra = content[@"extra"];
    messageContent = image;
  } else if ([objectName isEqualToString:@"RC:FileMsg"]) {
    NSString *local = content[@"local"];
    RCFileMessage *file = [RCFileMessage
        messageWithFile:[local stringByReplacingOccurrencesOfString:@"file://" withString:@""]];
    file.extra = content[@"extra"];
    messageContent = file;
  } else if ([objectName isEqualToString:@"RC:LBSMsg"]) {
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(
        [content[@"latitude"] doubleValue], [content[@"longitude"] doubleValue]);
    RCLocationMessage *location = [RCLocationMessage messageWithLocationImage:nil
                                                                     location:coordinate
                                                                 locationName:content[@"name"]];
    location.extra = content[@"extra"];
    messageContent = location;
  } else if ([objectName isEqualToString:@"RC:VcMsg"]) {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:content[@"data"] options:0];
    RCVoiceMessage *voice = [RCVoiceMessage messageWithAudio:data
                                                    duration:[content[@"duration"] intValue]];
    voice.extra = content[@"extra"];
    messageContent = voice;
  } else if ([objectName isEqualToString:@"RC:CmdMsg"]) {
    messageContent = [RCCommandMessage messageWithName:content[@"name"] data:content[@"data"]];
  } else if ([objectName isEqualToString:@"RC:ContactNtf"]) {
    messageContent =
        [RCContactNotificationMessage notificationWithOperation:content[@"operation"]
                                                   sourceUserId:content[@"sourceUserId"]
                                                   targetUserId:content[@"targetUserId"]
                                                        message:content[@"message"]
                                                          extra:content[@"extra"]];
  } else if ([objectName isEqualToString:@"RC:HQVCMsg"]) {
    NSString *local = content[@"local"];
    RCHQVoiceMessage *message = [RCHQVoiceMessage
        messageWithPath:[local stringByReplacingOccurrencesOfString:@"file://" withString:@""]
               duration:[content[@"duration"] intValue]];
    message.extra = content[@"extra"];
    messageContent = message;
  } else if ([objectName isEqualToString:@"RC:GIFMsg"]) {
    // TODO: RCGIFMessage
  }

  if (messageContent) {
    NSDictionary *userInfo = content[@"userInfo"];
    if (userInfo) {
      messageContent.senderUserInfo = [[RCUserInfo alloc] initWithUserId:userInfo[@"userId"]
                                                                    name:userInfo[@"name"]
                                                                portrait:userInfo[@"portraitUrl"]];
    }

    NSDictionary *mentionedInfo = content[@"mentionedInfo"];
    if (mentionedInfo) {
      messageContent.mentionedInfo =
          [[RCMentionedInfo alloc] initWithMentionedType:[mentionedInfo[@"type"] intValue]
                                              userIdList:mentionedInfo[@"userIdList"]
                                        mentionedContent:mentionedInfo[@"mentionedContent"]];
    }
  }

  return messageContent;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"rcimlib-connect",
    @"rcimlib-connection-status",
    @"rcimlib-receive-message",
    @"rcimlib-send-message",
    @"rcimlib-typing-status",
    @"rcimlib-read-receipt-received",
    @"rcimlib-receipt-request",
    @"rcimlib-receipt-response",
    @"rcimlib-log",
    @"rcimlib-download-media-message",
    @"rcimlib-recall",
    @"rcimlib-customer-service",
    @"rcimlib-notify-msg-arrived",
    @"rcimlib-notify-msg-clicked",
  ];
}

@end
