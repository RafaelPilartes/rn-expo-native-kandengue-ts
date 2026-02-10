import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'

export const BACKGROUND_LOCATION_TASK = 'BACKGROUND_LOCATION_TASK'

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('[BackgroundLocationTask] Error:', error)
    return
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] }
    const latestLocation = locations[0]

    if (latestLocation) {
      // TODO: Implement logic to update server or local state
      console.log(
        '[BackgroundLocationTask] New location:',
        latestLocation.coords
      )

      // Example check for active rides (pseudo-code, needs actual store access or storage check)
      // const activeRides = await AsyncStorage.getItem('active_rides');
      // if (activeRides && JSON.parse(activeRides).length > 0) {
      //   // Send to API
      // }
    }
  }
})
