
## 客服业务

- 在进入到客服聊天界面时，调用 `startCustomService` 来启动客服服务。启动的状态要在回调里面处理，启动成功后会回调 `success`，
  并携带配置信息 `CustomServiceConfig` 。根据 `modeChanged` 回调来处理不同的键盘输入。在机器人优先模式下，需要在界面上加上转人工的按钮。

- 当 `quit` 时，离开客服会话或者提示客服服务已经结束。

- 当用户按下转人工服务时，调用 `switchToHumanMode` 来切换到人工服务。如果调用成功，`modeChanged` 回调返回服务类型。

- 当离开界面时，调用 `stopCustomeService` 来结束客服。

- 在适当的时机对客服进行评价，调用 `evaluateCustomService`，根据参数不同评价机器人或者人工。

- 当 `selectGroup` 时，App 需要弹出技能组选择界面供用户选择。

- 当用户选择技能组后，调用 `selectCustomerServiceGroup` 来启动对应技能组客服，
  如果用户没有选择，也必须调用 `selectCustomerServiceGroup` 来启动默认客服，groupId 此时为 `null`。

```typescript
/**
 * 发起客服聊天回调
 */
type CSCallback = {
  success?: (config: CSConfig) => void;
  error?: (code: number, message: string) => void;
  modeChanged?: (mode: CSMode) => void;
  pullEvaluation?: (dialogId: string) => void;
  quit?: (message: string) => void;
  selectGroup?: (groups: CSGroupItem[]) => void;
};

/**
 * 发起客服聊天
 *
 * @param kefuId 客服 ID
 * @param csInfo 客服信息
 * @param callback 回调
 */
function startCustomerService(kefuId: string, csInfo: CSInfo, callback?: CSCallback): void;

/**
 * 切换至人工客服
 *
 * @param kefuId 客服 ID
 */
function switchToHumanMode(kefuId: string): void;

/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param groupId 分组 ID
 */
function selectCustomerServiceGroup(kefuId: string, groupId: string): void;

/**
 * 评价客服
 *
 * @param kefuId 客服 ID
 * @param dialogId 会话 Id，客服后台主动拉评价的时候（onPullEvaluation）这个参数有效，其余情况传空字符串即可
 * @param value 评价分数，取值范围 1 - 5
 * @param suggest 客户建议
 * @param resolveStatus 解决状态
 * @param tagText 标签
 * @param extra 用于扩展的额外信息
 */
function evaluateCustomerService(
  kefuId: string,
  dialogId: string,
  value: string,
  suggest: string,
  resolveStatus: number,
  tagText?: string,
  extra?: string
): void;

/**
 * 选择客服分组模式
 *
 * @param kefuId 客服 ID
 * @param message 客服留言信息
 */
function leaveMessageCustomerService(kefuId: string, message: CSLeaveMessageItem): void;

/**
 * 结束客服聊天
 *
 * @param kefuId 客服 ID
 */
function stopCustomerService(kefuId: string): void;
```
