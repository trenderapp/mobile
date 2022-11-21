import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

export const currentFcmToken = async () => {
  const token = await EncryptedStorage.getItem("fcmToken");
  if (token) return token;
  return;
}

export const notificationChannels = async () => {
  // await notifee.deleteChannel("sound")
  const channels = await notifee.getChannels();
  if(channels.some(c => c.name === "sound")) return;
  await notifee.createChannel({
    id: "sound",
    name: "Custom notification sound",
    description: "The default message notification channel",
    lights: false,
    vibration: true,
    importance: AndroidImportance.HIGH,
    sound: "notification",
    vibrationPattern: [200, 100, 200, 75, 300, 150]
  })
  await notifee.setNotificationCategories([
    {
      id: "message",
      actions: [
        {
          id: "read",
          title: "mark as read",
        },
        {
          id: "reply",
          title: "Reply",
          input: {
            placeholderText: "Aa ..."
          }
        }
      ]
    }
  ])
}

export const resetFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await EncryptedStorage.setItem("fcmToken", fcmToken);

      return fcmToken
    }
  } catch (error) {
    console.log(`Error firebase getToken : ${error}`);
  }
  return;
}

export const initNotificationToken = async () => {
  const token = await EncryptedStorage.getItem("fcmToken");
  if (!token || token === "null") {
    const fcmToken = await resetFcmToken();
    return fcmToken;
  } else {
    return;
  }
}

// Use on IOS permissions
export async function requestNotificationPermission() {
  let enabled = false;
  if(Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission({
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      provisional: false,
      sound: true,
    });
    enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  } else if(Platform.OS === "android") {
    let check = undefined;
    const notification = await checkNotifications();
    if(notification !== RESULTS.GRANTED || notification !== RESULTS.LIMITED) check = await requestNotifications(["alert", "badge", "criticalAlert", "providesAppSettings", "provisional", "sound"]);
    enabled = check.status === RESULTS.GRANTED || check.status === RESULTS.LIMITED;
  }

  if (enabled) {
    const requested = await initNotificationToken();
    if (!requested) return;
    return requested;
  }
}

export const notificationListener = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage.notification);
    // navigation.navigate(remoteMessage.data.type);
  });

  /*messaging().onMessage((message) => {
    console.log("Receive message on foreground", message.data.notifee);
  })*/

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      // setLoading(false);
    });
}