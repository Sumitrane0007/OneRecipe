// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import Home from './src/screen/Home';
import About from './src/screen/About';
import RecipeDetail from './src/components/RecipeDetail';
import SignupScreen from './src//screen/Signup'
import Login from './src/screen/Login';
import Profile from './src/components/Profile';
import Recipe from './src/components/Recipe';
import Loader from './src/components/Loader';
// import Detail from './src/Detail';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator >
          <Stack.Screen name='home' component={Home} options={{headerShown:false}}/>
          <Stack.Screen name='About' component={About} options={{headerShown:false}}/>
          <Stack.Screen name='RecipeDetail' component={RecipeDetail} options={{headerShown:false}}/>
          <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
          <Stack.Screen name='Signup' component={SignupScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
          <Stack.Screen name='Recipe' component={Recipe} options={{headerShown:false}}/>
          <Stack.Screen name="Loader" component={Loader} options={{headerShown:false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
