import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { notificationChannels } from './src/Services/notifications';
import { adminNotification, directMessageNotification } from './src/Services/notifications/notificationMessage';

import App from './src/App';
import { name as appName } from './app.json';
import { getStorageInfo } from './src/Services/storage';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (!remoteMessage?.data?.notifee) return console.log(!remoteMessage?.data?.notifee);
    const data = JSON.parse(remoteMessage.data.notifee);
    if (data.type === "message") await directMessageNotification(data);
    else if (data.type === "admin") await adminNotification(data);
});
  
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const user_info = getStorageInfo("user_info");
    if(!user_info) return;
    if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'mark-as-read') {
      const data = detail.notification.data;
      await axiosInstance.post(`/messages/${data.channelID}/${data.messageID}`, {}, {
        headers: {
          'trendertokenapi': user_info.token
        }
      });
      await notifee.cancelNotification(detail.notification.id);
    } else if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'reply') {
      const data = detail.notification.data;
      await axiosInstance.post(`/messages/${data.channelID}`, { content: detail.input }, {
        headers: {
          'trendertokenapi': user_token
        }
      }).then(r => console.log(r.data))
      await notifee.cancelNotification(detail.notification.id);
    }
})
  
notificationChannels()

AppRegistry.registerComponent(appName, () => App);