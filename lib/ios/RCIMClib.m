#import "RCIMClib.h"

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
                                          content:[self toMessageContent:content]
                                      pushContent:message[@"pushContent"]
                                         pushData:message[@"pushData"]
                                         progress:progressBlock
                                          success:successBlock
                                            error:errorBlock
                                           cancel:cancelBlock];
  } else {
    [RCIMClient.sharedRCIMClient sendMessage:[message[@"conversationType"] intValue]
                                    targetId:message[@"targetId"]
                                     content:[self toMessageContent:content]
                                 pushContent:message[@"pushContent"]
                                    pushData:message[@"pushData"]
                                     success:successBlock
                                       error:errorBlock];
  }
}

RCT_EXPORT_METHOD(recallMessage
                  : (double)id
                  : (NSString *)pushContent
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCMessage *message = [RCIMClient.sharedRCIMClient getMessage:id];
  [RCIMClient.sharedRCIMClient recallMessage:message
      pushContent:pushContent
      success:^(long messageId) {
        resolve(nil);
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
  resolve([self fromMessage:message]);
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

RCT_EXPORT_METHOD(getConversation
                  : (int)conversationType
                  : (NSString *)targetId
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  RCConversation *conversation = [RCIMClient.sharedRCIMClient getConversation:conversationType
                                                                     targetId:targetId];
  resolve([self fromConversation:conversation]);
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
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  NSArray *list = [RCIMClient.sharedRCIMClient getConversationList:conversationTypes];
  NSMutableArray *array = [NSMutableArray arrayWithCapacity:list.count];
  for (int i = 0; i < list.count; i += 1) {
    array[i] = [self fromConversation:list[i]];
  }
  resolve(array);
}

RCT_EXPORT_METHOD(setConversationNotificationStatus
                  : (int)conversationType
                  : (NSString *)targetId
                  : (int)status
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [RCIMClient.sharedRCIMClient setConversationNotificationStatus:conversationType
      targetId:targetId
      isBlocked:!status
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
        resolve(@(status));
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
    @"lastestMessageId" : @(conversation.lastestMessageId),
    @"lastestMessage" : [self fromMessageContent:conversation.lastestMessage],
    @"receivedStatus" : @(conversation.receivedStatus),
    @"receivedTime" : @(conversation.receivedTime),
    @"sentTime" : @(conversation.sentTime),
    @"sentStatus" : @(conversation.sentStatus),
    @"senderUserId" : conversation.senderUserId,
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
    @"receivedTime" : @(message.receivedTime),
    @"content" : [self fromMessageContent:message.content],
    @"extra" : message.extra ? message.extra : @"",
  };
}

- (NSDictionary *)fromMessageContent:(RCMessageContent *)content {
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
  } else if ([content isKindOfClass:[RCDiscussionNotificationMessage class]]) {
    RCDiscussionNotificationMessage *message = (RCDiscussionNotificationMessage *)content;
    return @{
      @"type" : @"discussion-notification",
      @"notificationType" : @(message.type),
      @"operatorId" : message.operatorId,
      @"extension" : message.extension,
    };
  } else if ([content isKindOfClass:[RCLocationMessage class]]) {
    RCLocationMessage *message = (RCLocationMessage *)content;
    return @{
      @"type" : @"voice",
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
      @"type" : @"voice",
      @"data" : data,
      @"duration" : @(message.duration),
      @"extra" : message.extra ? message.extra : @"",
    };
  }
  return @{@"error" : @"Content type not yet supported"};
}

- (RCMessageContent *)toMessageContent:(NSDictionary *)content {
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
  } else if ([type isEqualToString:@"location"]) {
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(
        [content[@"latitude"] doubleValue], [content[@"longitude"] doubleValue]);
    RCLocationMessage *location = [RCLocationMessage messageWithLocationImage:nil
                                                                     location:coordinate
                                                                 locationName:content[@"name"]];
    location.extra = content[@"extra"];
    return location;
  } else if ([type isEqualToString:@"voice"]) {
    NSData *data = [[NSData alloc] initWithBase64EncodedString:content[@"data"] options:0];
    RCVoiceMessage *voice = [RCVoiceMessage messageWithAudio:data
                                                    duration:[content[@"duration"] intValue]];
    voice.extra = content[@"extra"];
    return voice;
  }
  return nil;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"rcimlib-connect", @"rcimlib-connection-status", @"rcimlib-receive-message",
    @"rcimlib-send-message", @"rcimlib-typing-status", @"rcimlib-read-receipt-received",
    @"rcimlib-receipt-request", @"rcimlib-receipt-response", @"rcimlib-log"
  ];
}

@end
