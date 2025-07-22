import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import AppNav from './navigation/AppNav';
import AuthContextProvider from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';


export default function App() {
  return (
    <ErrorBoundary>
      <StatusBar style='light' />
      <AuthContextProvider>
        <AppNav />
      </AuthContextProvider>
    </ErrorBoundary>
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
