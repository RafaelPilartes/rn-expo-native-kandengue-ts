import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback
} from 'react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertButton {
  text: string
  onPress?: () => void
  style?: 'default' | 'cancel' | 'destructive'
}

interface AlertContextData {
  showAlert: (
    title: string,
    message: string,
    type?: AlertType,
    buttons?: AlertButton[]
  ) => void
  hideAlert: () => void
  alertVisible: boolean
  alertConfig: {
    title: string
    message: string
    type: AlertType
    buttons: AlertButton[]
  }
}

const AlertContext = createContext<AlertContextData>({} as AlertContextData)

export const useAlert = () => useContext(AlertContext)

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState({
    title: '',
    message: '',
    type: 'info' as AlertType,
    buttons: [] as AlertButton[]
  })

  const showAlert = useCallback(
    (
      title: string,
      message: string,
      type: AlertType = 'info',
      buttons: AlertButton[] = []
    ) => {
      setConfig({ title, message, type, buttons })
      setVisible(true)
    },
    []
  )

  const hideAlert = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        hideAlert,
        alertVisible: visible,
        alertConfig: config
      }}
    >
      {children}
      {/* CustomAlert component will be rendered here or in AppProvider using the context */}
    </AlertContext.Provider>
  )
}
