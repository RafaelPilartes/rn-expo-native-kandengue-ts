import { doc, getDoc } from '@react-native-firebase/firestore'
import { db } from '@/config/firebase.config'
import { firebaseCollections } from '@/constants/firebaseCollections'
import type { IAppConfigRepository } from '@/core/interfaces/IAppConfigRepository'
import type { ReferralSettingsInterface } from '@/interfaces/IPromotion'

function toDate(v: any): Date {
  if (typeof v?.toDate === 'function') return v.toDate()
  if (v instanceof Date) return v
  return new Date(v ?? Date.now())
}

export class FirebaseAppConfigDAO implements IAppConfigRepository {
  async getReferralSettings(): Promise<ReferralSettingsInterface | null> {
    const snap = await getDoc(
      doc(db, firebaseCollections.appConfig.root, 'referral_settings'),
    )
    if (!snap.exists()) return null
    const data = snap.data() as any
    return {
      minimum_withdrawal_amount: data.minimum_withdrawal_amount ?? 0,
      updated_by: data.updated_by ?? 'system',
      updated_at: toDate(data.updated_at),
    }
  }
}
