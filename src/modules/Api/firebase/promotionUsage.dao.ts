import {
  collection,
  doc,
  getDoc,
  onSnapshot,
} from '@react-native-firebase/firestore'
import { db } from '@/config/firebase.config'
import { firebaseCollections } from '@/constants/firebaseCollections'
import type { IPromotionUsageRepository } from '@/core/interfaces/IPromotionUsageRepository'
import type { PromotionUsage } from '@rafaelpilartes/kandengue-shared/usage'

function toDate(v: any): Date | null {
  if (!v) return null
  if (typeof v?.toDate === 'function') return v.toDate()
  if (v instanceof Date) return v
  return new Date(v)
}

function mapDoc(data: any): PromotionUsage {
  return {
    ...data,
    expires_at: toDate(data.expires_at),
    created_at: toDate(data.created_at) ?? new Date(),
    updated_at: toDate(data.updated_at) ?? new Date(),
  } as PromotionUsage
}

export class FirebasePromotionUsageDAO implements IPromotionUsageRepository {
  private ref = collection(db, firebaseCollections.promotionUsages.root)

  async getActiveReservation(
    userId: string,
  ): Promise<PromotionUsage | null> {
    const snap = await getDoc(doc(this.ref, `active_reservation_${userId}`))
    if (!snap.exists()) return null
    return mapDoc(snap.data())
  }

  async getByRideId(
    rideId: string,
  ): Promise<PromotionUsage | null> {
    const snap = await getDoc(doc(this.ref, `${rideId}_promo`))
    if (!snap.exists()) return null
    return mapDoc(snap.data())
  }

  listenActiveReservation(
    userId: string,
    onUpdate: (usage: PromotionUsage | null) => void,
    onError?: (err: Error) => void,
  ): () => void {
    return onSnapshot(
      doc(this.ref, `active_reservation_${userId}`),
      snap => {
        if (!snap.exists()) {
          onUpdate(null)
          return
        }
        onUpdate(mapDoc(snap.data()))
      },
      err => {
        if (onError) onError(err as Error)
      },
    )
  }
}
