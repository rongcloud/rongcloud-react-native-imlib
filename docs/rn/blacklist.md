
支持将用户加入、移出黑名单及查询当前已经设置的黑名单，黑名单列表中的用户不能向该用户发送消息。

```javascript
import {
  addToBlacklist,
  removeFromBlacklist,
  getBlacklistStatus,
  getBlacklist
} from "rongcloud-react-native-imlib";

// 将用户添加至黑名单
addToBlacklist(userId);

// 将用户从黑名单移出
removeFromBlacklist(userId);

// 查询某个用户是否已经在黑名单中
const isBlack = await getBlacklistStatus(userId);

// 获取所有黑名单
const blackList = await getBlacklist();
```
