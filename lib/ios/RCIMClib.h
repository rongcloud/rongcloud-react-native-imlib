#import <React/RCTEventEmitter.h>
#import <RongIMLib/RongIMLib.h>

@interface RCIMClib : RCTEventEmitter <RCTBridgeModule, RCConnectionStatusChangeDelegate,
                                       RCIMClientReceiveMessageDelegate, RCTypingStatusDelegate, RCLogInfoDelegate>
@end
