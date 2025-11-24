// src/config/firebase.config.ts
import { getFirestore } from '@react-native-firebase/firestore'
import { getAuth } from '@react-native-firebase/auth'
import { getStorage } from '@react-native-firebase/storage'

// Initialize Firebase services
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
