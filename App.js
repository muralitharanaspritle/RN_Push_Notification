import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import notifee, {
  EventType,
  TimestampTrigger,
  TriggerType,
  IntervalTrigger,
  AndroidImportance,
  AndroidBadgeIconType,
  AndroidVisibility,
  AndroidColor,
  AndroidCategory,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Center} from './Config/Alignment';
import {
  androidNotification,
  displayNotification,
} from './Service/Messages/Android';
const App = () => {
  //for Remote Notication
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState('');

  //foreground Notification
  // useEffect(() => {
  //   requestUserPermission();
  //   registerDeviceFCM();
  //   const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         console.log('User dismissed notification', detail.notification);
  //         break;
  //       case EventType.PRESS:
  //         //setLoading(false);
  //         console.log('User pressed notification', detail.notification);
  //         break;
  //       case EventType.ACTION_PRESS:
  //         console.log(detail.input, 'Input');
  //         setReplyInput(detail.input);
  //         break;
  //     }
  //   });

  //   const unsubscribe2 = messaging().onMessage(async remoteMessage => {
  //     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   // getInital is deprecated in ios
  //   Platform.OS === 'android' &&
  //     remoteNotification()
  //       .then(res => {
  //         // setLoading(false)
  //         console.log(res, 'Initial Notification');
  //       })
  //       .catch(err => console.log(err));

  //   // Sometime later...
  //   return () => {
  //     unsubscribe(), unsubscribe2();
  //   };
  // }, []);
  useEffect(() => {
    Platform.OS === 'android' && androidNotification();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const registerDeviceFCM = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log(token, 'ToKEN');
  };

  let channelId;
  const channel = async () => {
    channelId = await notifee.createChannel({
      id: 'muralichannel',
      name: 'Murali Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [300, 500],
      lights: true,
      lightColor: AndroidColor.WHITE,
    });
  };

  const displayNotification = async () => {
    const notificationId = await notifee.displayNotification({
      title:  '<p style="color: #000000;"><b>01 Jun 2022 Log 102868 Update</span></p></b></p>',
      body: '01 Jun 2022 Log 102868 Update: Rainfall exceeding threshold value for S234(S224) was back to normal. All parties Informed.',
      android: {
        channelId,
        color: AndroidColor.RED,
        smallIcon: 'ic_small_icon',
        largeIcon: require('./assets/Notification/ifms_logo.png'),
        badgeIconType: AndroidBadgeIconType.SMALL,
        visibility: AndroidVisibility.PRIVATE,
        vibrationPattern: [300, 500],
        ongoing: false,
        fullScreenAction:{
          id:channelId
        },
        actions: [
          {
            title: '<b>Reply</b> &#129312;',
            pressAction: {id: 'Replay'},
            pressAction: {
              id: 'Replay',
            },
            input: {
              allowFreeFormInput: true, // set to false
              choices: ['Acknowledge', 'Delay', 'Messages'],
              placeholder: 'Reply to task...',
            },
          },
          {
            title: '<p style="color: #f44336;"><b>Dismiss</b> &#128557;</p>',
            pressAction: {id: 'Dismiss'},
          },
        ],
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const androidNotification = async () => {
    // permission
    await notifee.requestPermission();

    // FCM token
    registerDeviceFCM();

    // Channel
    channel();

    // Event
    // Trigger
    // Appearance (small,large icon, Badges, Importance, Visbility)
    // display Notification
  };

  // async function remoteNotification() {
  //   const initialNotification = await notifee.getInitialNotification();

  //   if (initialNotification) {
  //     console.log(
  //       'Notification caused application to open',
  //       initialNotification.notification,
  //     );
  //     console.log(
  //       'Press action used to open the app',
  //       initialNotification.pressAction,
  //     );
  //   }
  // }

  // // ********************************************************************** CRUD notification **********************************************************************
  // async function onCRUDDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   // await notifee.requestPermission();

  //   await notifee.requestPermission({
  //     criticalAlert: true,

  //   });

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     importance: AndroidImportance.MIN,
  //   });

  //   console.log("Channel ",channelId)

  //   // Display a notification
  //   const notificationId = await notifee.displayNotification({
  //     title: 'Demo notification !',
  //     body: 'Hey I am here!',
  //     android: {
  //       channelId,
  //       color: '#0c6487',
  //       smallIcon: 'ic_small_icon',
  //       largeIcon: require("./assets/Notification/React.png"),
  //       badgeIconType:AndroidBadgeIconType.SMALL,
  //       visibility:AndroidVisibility.PRIVATE,
  //       actions: [
  //         {
  //           title: '<b>Reply</b> &#129312;',
  //           pressAction: {id: 'Replay'},
  //           pressAction: {
  //             id: 'Replay',
  //           },
  //           input: {
  //             allowFreeFormInput: true, // set to false
  //             choices: ['Yes', 'No', 'Maybe'],
  //             placeholder: 'Reply to murali...',
  //           },
  //         },
  //         {
  //           title: '<p style="color: #f44336;"><b>No</b> &#128557;</p>',
  //           pressAction: {id: 'No'},
  //         },
  //       ],
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //     ios:{
  //       critical: true,
  //     }
  //   });

  //  // Sometime later...
  //   // setTimeout(async () => {
  //   //   await notifee.displayNotification({
  //   //     id: notificationId,
  //   //     title: 'Updated Notification Demo',
  //   //     body: 'Updated Demo',
  //   //     android: {
  //   //       channelId,
  //   //     },
  //   //   });
  //   // }, 2000);

  //   // setTimeout(async () => {
  //   //   await notifee.cancelNotification(notificationId);
  //   // }, 3000);
  // }

  // // ********************************************************************** Schedule **********************************************************************

  // //android alarm permission
  // const androidAlarmPermission = async () => {
  //   const settings = notifee.getNotificationSettings();
  //   if (settings?.android?.alarm == AndroidNotificationSetting.ENABLED) {
  //     //Create timestamp trigger
  //   } else {
  //     // Show some user information to educate them on what exact alarm permission is,
  //     // and why it is necessary for your app functionality, then send them to system preferences:
  //     await notifee.openAlarmPermissionSettings();
  //   }
  // };

  // // schedule a notification
  // async function onCreateTriggerNotification() {
  //   //  Platform.OS === 'android' && androidAlarmPermission();

  //   const date = new Date(Date.now());
  //   let getHour = date.getHours();
  //   let getMin = date.getMinutes();

  //   date.setHours(getHour);
  //   date.setMinutes(getMin + 1);
  //   console.log(date);
  //   // Create a time-based trigger
  //   const trigger = {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
  //   };

  //   // Create a trigger notification
  //   await notifee.createTriggerNotification(
  //     {
  //       title: 'Meeting with Murali',
  //       body: `${date.getHours()}: ${date.getMinutes()}`,
  //       android: {
  //         channelId: 'default',
  //       },
  //     },
  //     trigger,
  //   );

  //   // get triggered notification
  //   // notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
  // }

  // // ************************FCM*********************************************************************
  // const registerDeviceFCM = async () => {
  //   // Register the device with FCM
  //   await messaging().registerDeviceForRemoteMessages();

  //   // Get the token
  //   const token = await messaging().getToken();
  //   console.log(token, 'ToKEN');

  // };

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // const iosPushNotify=async()=>{

  //   await notifee.setNotificationCategories([
  //     {
  //       id: 'message',
  //       actions: [
  //         {
  //           id: 'reply',
  //           title: 'Reply',
  //           input: {
  //             placeholderText: 'Send a message...',
  //             buttonText: 'Send Now',
  //           },
  //         },
  //       ],
  //     },
  //   ]);
  //   console.log(cat,"cat")
  //   await notifee.displayNotification({
  //     title: 'New post from John',
  //     body: 'Hey everyone! Check out my new blog post on my website.',
  //     ios: {
  //       categoryId: 'message',
  //       critical:true,
  //       foregroundPresentationOptions: {
  //         badge: true,
  //         sound: true,
  //         banner: true,
  //         list: false,
  //       },
  //     },
  //   });
  // }

  // if (!loading) {
  //   return null;
  // }

  return (
    <View style={styles.container}>
      <View style={{...Center}}>
        <Text style={[styles.text, {fontSize: 20, color: 'black'}]}>
          {replyInput}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // onCRUDDisplayNotification();
          displayNotification();
        }}>
        <Text style={styles.text}>NOTIFY</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onCreateTriggerNotification();
        }}>
        <Text style={styles.text}>Schedule for 1 min delay</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          iosPushNotify();
        }}>
        <Text style={styles.text}>ios</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  button: {
    flex: 0.1,
    ...Center,
    backgroundColor: '#438de8',
    borderRadius: 50,
    margin: 20,
    elevation: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});
