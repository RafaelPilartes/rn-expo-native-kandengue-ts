import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocation } from '../../context/LocationContext'

interface Props {
  visible: boolean
  onAccept: () => void
  onDecline: () => void
}

export const LocationDisclosureModal: React.FC<Props> = ({
  visible,
  onAccept,
  onDecline
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Location Access</Text>
          <Text style={styles.message}>
            Kandengue Atrevido collects location data to enable ride tracking
            and safety features even when the app is closed or not in use.
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={onDecline}
              style={[styles.button, styles.declineButton]}
            >
              <Text style={styles.declineText}>Deny</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAccept}
              style={[styles.button, styles.acceptButton]}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  declineButton: {
    backgroundColor: '#f0f0f0'
  },
  acceptButton: {
    backgroundColor: '#007bff'
  },
  declineText: {
    color: '#333'
  },
  acceptText: {
    color: 'white',
    fontWeight: 'bold'
  }
})
