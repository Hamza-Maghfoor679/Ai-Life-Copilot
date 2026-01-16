import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Splash = () => {

  useEffect(() => {
    setTimeout(() => {
      router.replace('/(auth)/onboarding')
    }, 2000);
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome to AI Copilot</Text>
    </SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})