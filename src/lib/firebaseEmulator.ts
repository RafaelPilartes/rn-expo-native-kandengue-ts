import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

if (__DEV__) {
  const HOST = '192.168.0.205'

  // Prevenir crash no Fast Refresh
  if (!(global as any).__FIREBASE_EMULATOR_STARTED__) {
    // Firestore: settings() é a API correta em @react-native-firebase v23+
    firestore().settings({
      host: `${HOST}:8080`,
      ssl: false,
      persistence: false
    })

    auth().useEmulator(`http://${HOST}:9099`)

    console.log(`[Emulator] Firestore → ${HOST}:8080`)
    console.log(`[Emulator] Auth → ${HOST}:9099`)
    
    ;(global as any).__FIREBASE_EMULATOR_STARTED__ = true
  }
}
