#import <React/RCTEventEmitter.h>
#import <RongIMLib/RongIMLib.h>

#ifndef dispatch_queue_async_safe
#define dispatch_queue_async_safe(queue, block)\
    if (strcmp(dispatch_queue_get_label(DISPATCH_CURRENT_QUEUE_LABEL), dispatch_queue_get_label(queue)) == 0) {\
        block();\
    } else {\
        dispatch_async(queue, block);\
    }
#endif

#ifndef dispatch_main_async_safe
#define dispatch_main_async_safe(block) dispatch_queue_async_safe(dispatch_get_main_queue(), block)
#endif

// 推送相关通知名
#define RC_APNS_NOTIFICATION_ARRIVED_EVENT      @"RC_APNS_NOTIFICATION_ARRIVED_EVENT"
#define RC_APNS_NOTIFICATION_OPEN_EVENT         @"RC_APNS_NOTIFICATION_OPEN_EVENT"

@interface RCIMClib : RCTEventEmitter <RCTBridgeModule, RCConnectionStatusChangeDelegate,
                                       RCIMClientReceiveMessageDelegate, RCTypingStatusDelegate, RCLogInfoDelegate>

+ (void)setDeviceToken:(NSData *)deviceToken;

@end
