import * as Notifications from "expo-notifications";

// This tells the OS how to handle the notification when the app is OPEN
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleTaskReminder(
  logId: string,
  intention: string,
  secondsFromNow: number
) {
  // Request Permissions

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    console.log("Permission Denied");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Task Still Pending...",
      body: `You haven't finished ${intention}`,
      categoryIdentifier: logId,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow,
    },
  });
  console.log(`Reminder Schedule for ${intention} in  ${secondsFromNow}`);
}

export async function cancelTaskReminder(logId: string) {
  await Notifications.dismissNotificationAsync(logId);
  await Notifications.cancelScheduledNotificationAsync(logId);
}

export async function defaultNotification() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission Denied");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Keeping Promises takes you higher you can imagine",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 86400,
    },
  });
}
