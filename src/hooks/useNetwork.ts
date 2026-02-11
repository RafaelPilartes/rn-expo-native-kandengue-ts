import { NetworkContext } from '@/providers/NetworkProvider'
import React from 'react'

// src/hooks/useNetwork.ts
export const useNetwork = () => React.useContext(NetworkContext)
