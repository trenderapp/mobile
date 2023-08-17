import notifee, { AndroidStyle } from "@notifee/react-native";

export const directMessageNotification = async (data: any) => {

    notifee.displayNotification({
      title: data?.title ?? "New direct message",
      body: data?.message ?? " ",
      data: data,
      android: {
        smallIcon: "ic_small_icon", // Not in backend
        color: "#23232e", // Not in backend
        channelId: "sound", // Not in backend
        style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: data.title,
              icon: data.avatar,
            },
            messages: [{
                text: data?.message,
                timestamp: data.created_at,
                person: {
                    name: data.title,
                    icon: data.avatar,
                },
            }]
        },
        actions: [{
          title: "mark as read",
          pressAction: {
            id: "mark-as-read"
          },
        },
        {
          title: "Reply",
          pressAction: {
            id: "reply"
          },
          input: {
            allowFreeFormInput: true,
            placeholder: "Aa ..."
          }
        }]
      },
      ios: {
        categoryId: "message",
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
        sound: "notification.wav"
      }
    })
  }