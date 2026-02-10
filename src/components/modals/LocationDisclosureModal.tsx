import React from 'react'
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MapPin, Shield } from 'lucide-react-native'
import PrimaryButton from '@/components/ui/button/PrimaryButton'

interface LocationDisclosureModalProps {
  visible: boolean
  onAccept: () => void
  onDecline: () => void
}

const LocationDisclosureModal = ({
  visible,
  onAccept,
  onDecline
}: LocationDisclosureModalProps) => {
  const { t } = useTranslation(['onboarding', 'common'])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Shield size={48} color="#3B82F6" />
              <View style={styles.iconBadge}>
                <MapPin size={20} color="white" />
              </View>
            </View>

            <Text style={styles.title}>
              {t('onboarding:location_disclosure_title')}
            </Text>

            <Text style={styles.message}>
              {t('onboarding:location_disclosure_message')}
            </Text>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={t('common:buttons.accept')}
              onPress={onAccept}
              variant="primary"
              className="w-full mb-3"
            />
            <PrimaryButton
              label={t('common:buttons.decline')}
              onPress={onDecline}
              variant="outline"
              className="w-full"
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#2424244b',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%'
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 20
  },
  iconContainer: {
    marginBottom: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF'
  },
  iconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12
  },
  message: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22
  },
  buttonContainer: {
    width: '100%'
  }
})

export default LocationDisclosureModal
