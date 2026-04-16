// src/storage/store/useRideFlowStore.ts
import { create } from 'zustand'
import { CustomPlace } from '@/types/places'
import { PaymentMethodType, PickupOptionType } from '@/types/ride'
import { UserInterface } from '@/interfaces/IUser'

export type RideFlowStep = 1 | 2 | 3

interface PersonInfo {
  name: string
  phone: string
}

interface RideFlowState {
  // Navigation between steps
  step: RideFlowStep

  // Step 1 — Route
  pickup: CustomPlace | null
  dropoff: CustomPlace | null

  // Step 2 — Delivery Options
  articleType: string
  paymentMethod: PaymentMethodType
  senderIsSelf: boolean
  receiverIsSelf: boolean
  sender: PersonInfo
  receiver: PersonInfo

  // Step 3 — Extra Details
  description: string
  driverInstructions: string
  pickupOption: PickupOptionType

  // Actions
  setStep: (step: RideFlowStep) => void
  nextStep: () => void
  prevStep: () => void

  setPickup: (place: CustomPlace | null) => void
  setDropoff: (place: CustomPlace | null) => void

  // Map pin picking mode — null = off, 'pickup'/'dropoff' = active
  mapPickingMode: 'pickup' | 'dropoff' | null
  setMapPickingMode: (mode: 'pickup' | 'dropoff' | null) => void

  setArticleType: (type: string) => void
  setPaymentMethod: (method: PaymentMethodType) => void

  setSenderIsSelf: (isSelf: boolean, user?: UserInterface) => void
  setReceiverIsSelf: (isSelf: boolean, user?: UserInterface) => void
  setSender: (info: PersonInfo) => void
  setReceiver: (info: PersonInfo) => void

  setDescription: (text: string) => void
  setDriverInstructions: (text: string) => void
  setPickupOption: (option: PickupOptionType) => void

  // Reset the entire flow on exit
  reset: () => void
}

const initialState = {
  step: 1 as RideFlowStep,
  pickup: null,
  dropoff: null,
  mapPickingMode: null as 'pickup' | 'dropoff' | null,
  articleType: 'Documentos',
  paymentMethod: 'cash' as PaymentMethodType,
  senderIsSelf: true,
  receiverIsSelf: false,
  sender: { name: '', phone: '' },
  receiver: { name: '', phone: '' },
  description: '',
  driverInstructions: '',
  pickupOption: 'door' as PickupOptionType,
}

export const useRideFlowStore = create<RideFlowState>((set, get) => ({
  ...initialState,

  setStep: step => set({ step }),

  nextStep: () => {
    const current = get().step
    if (current < 3) set({ step: (current + 1) as RideFlowStep })
  },

  prevStep: () => {
    const current = get().step
    if (current > 1) set({ step: (current - 1) as RideFlowStep })
  },

  setPickup: place => set({ pickup: place }),
  setDropoff: place => set({ dropoff: place }),

  setMapPickingMode: mode => set({ mapPickingMode: mode }),

  setArticleType: type => set({ articleType: type }),
  setPaymentMethod: method => set({ paymentMethod: method }),

  setSenderIsSelf: (isSelf, user) => {
    set({
      senderIsSelf: isSelf,
      sender: isSelf && user
        ? { name: user.name, phone: user.phone }
        : { name: '', phone: '' },
    })
  },

  setReceiverIsSelf: (isSelf, user) => {
    set({
      receiverIsSelf: isSelf,
      receiver: isSelf && user
        ? { name: user.name, phone: user.phone }
        : { name: '', phone: '' },
    })
  },

  setSender: info => set({ sender: info }),
  setReceiver: info => set({ receiver: info }),

  setDescription: text => set({ description: text }),
  setDriverInstructions: text => set({ driverInstructions: text }),
  setPickupOption: option => set({ pickupOption: option }),

  reset: () => set(initialState),
}))
