import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import notifee, {
  EventType,
  TimestampTrigger,
  TriggerType,
  IntervalTrigger,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Center} from './Config/Alignment';
const App = () => {
  //for Remote Notication
  const [loading, setLoading] = useState(true);

  //foreground Notification
  useEffect(() => {

    requestUserPermission()
    registerDeviceFCM();
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          //setLoading(false);
          console.log('User pressed notification', detail.notification);
          break;
      }
    });

    const unsubscribe2 = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    // getInital is deprecated in ios
    Platform.OS === 'android' &&
      remoteNotification()
        .then(res => {
          // setLoading(false)
          console.log(res, 'Initial Notification');
        })
        .catch(err => console.log(err));

    // Sometime later...
    return ()=>{
       unsubscribe(),
       unsubscribe2()
      }
  }, []);

  async function remoteNotification() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification,
      );
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction,
      );
    }
  }

  // ********************************************************************** CRUD notification **********************************************************************
  async function onCRUDDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    const notificationId = await notifee.displayNotification({
      title: 'Demo notification',
      body: 'Hey I am here!',
      android: {
        channelId,
        color: '#4caf50',
        actions: [
          {
            title: '<b>Yes</b> &#128111;',
            pressAction: {id: 'Yes'},
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

    // Sometime later...
    setTimeout(async () => {
      await notifee.displayNotification({
        id: notificationId,
        title: 'Updated Notification Demo',
        body: 'Updated Demo',
        android: {
          channelId,
        },
      });
    }, 2000);

    setTimeout(async () => {
      await notifee.cancelNotification(notificationId);
    }, 3000);
  }

  // ********************************************************************** Schedule **********************************************************************

  //android alarm permission
  const androidAlarmPermission = async () => {
    const settings = notifee.getNotificationSettings();
    if (settings?.android?.alarm == AndroidNotificationSetting.ENABLED) {
      //Create timestamp trigger
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      await notifee.openAlarmPermissionSettings();
    }
  };

  // schedule a notification
  async function onCreateTriggerNotification() {
    //  Platform.OS === 'android' && androidAlarmPermission();

    const date = new Date(Date.now());
    let getHour = date.getHours();
    let getMin = date.getMinutes();

    date.setHours(getHour);
    date.setMinutes(getMin + 1);
    console.log(date);
    // Create a time-based trigger
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Meeting with Murali',
        body: `${date.getHours()}: ${date.getMinutes()}`,
        android: {
          channelId: 'default',
        },
      },
      trigger,
    );

    // get triggered notification
    // notifee.getTriggerNotificationIds().then(ids => console.log('All trigger notifications: ', ids));
  }

  // ************************FCM*********************************************************************
  const registerDeviceFCM = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log(token,"ToKEN")
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  if (!loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onCRUDDisplayNotification();
        }}>
        <Text style={styles.text}>CRUD NOTIFY</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onCreateTriggerNotification();
        }}>
        <Text style={styles.text}>Schedule for 1 min delay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
  },
  button: {
    flex: 0.1,
    ...Center,
    backgroundColor: 'red',
    borderRadius: 20,
    margin: 20,
    elevation: 10,
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
});
