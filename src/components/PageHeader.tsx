import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeft } from 'lucide-react-native'

interface Props {
  title: string
  canGoBack?: boolean
  rightComponent?: React.ReactNode
}

export const PageHeader: React.FC<Props> = ({
  title,
  canGoBack = true,
  rightComponent
}) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {canGoBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft color="black" size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  rightContainer: {
    //
  }
})
