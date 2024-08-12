import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNav from './navigation/AppNav';
import AuthContextProvider from './context/AuthContext';
import Toast from 'react-native-toast-message'


export default function App() {
  return (
    <>
    <StatusBar style='dark' />
      <AuthContextProvider>
        <AppNav />
      </AuthContextProvider>
      <Toast />
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
