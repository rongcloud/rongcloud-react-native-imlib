
通过添加消息监听器，可以监听到所有接收的消息。

```javascript
import { addReceiveMessageListener } from "rongcloud-react-native-imlib";

const listener = addReceiveMessageListener(message => {
  console.log(message);
});
```

