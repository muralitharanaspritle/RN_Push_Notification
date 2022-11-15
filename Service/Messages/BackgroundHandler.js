import messaging from '@react-native-firebase/messaging';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
export const backgroundNotificationListener = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(remoteMessage.notification.title);
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: 'default',
        color: '#4caf50',
        actions: [
          {
            title: '<b>Reply</b> &#129312;',
            pressAction: {id: 'Replay'},
            pressAction: {
              id: 'Replay',
            },
            input: {
              allowFreeFormInput: true, // set to false
              choices: ['Yes', 'No', 'Maybe'],
              placeholder: 'Reply to murali...',
            },
          },
          {
            title: '<p style="color: #f44336;"><b>No</b> &#128557;</p>',
            pressAction: {id: 'No'},
          },
        ],
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  });
};
