设置当前用户离线消息存储时间，以天为单位，默认为 7 天，设置区间为 1 ~ 7 天。

```javascript
import { setOfflineMessageDuration, getOfflineMessageDuration } from "rongcloud-react-native-imlib";

setOfflineMessageDuration(days);

const duration = await getOfflineMessageDuration();
```