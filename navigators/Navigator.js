import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {Icon} from '@rneui/themed';

import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import ModifyProfile from '../views/ModifyProfile';


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// Hamburger navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName='Dinoman'
      screenOptions={{
        headerShown: true,
        swipeEnabled: false,
        headerTitleAlign: 'center',
        headerTintColor: '#33312E',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#FCF6B1',
        },
        drawerStyle: {
          backgroundColor: '#FCF6B1'
        },
      }}>
      <Drawer.Screen
        name='Dinoman'
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => <Icon
            name="home"
            color={'#33312E'}
          />
        }}
      />
      <Drawer.Screen
        name='Profile'
        component={ProfileStackNavigator}
        options={{
          drawerIcon: ({color}) => <Icon
            name="account-circle"
            color={'#33312E'}
          />
        }}
      />
    </Drawer.Navigator>
  );
};


// Tab navigator with stacks
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({color}) =>
            <Icon
              name="home"
              color={color}
            />,
          headerShown: false
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileStackNavigator}
      options={{
        tabBarIcon: ({color}) =>
          <Icon
            name="account-circle"
            color={color}
          />,
        headerShown: false
      }}
      />
    </Tab.Navigator>
  );
};


// Main stack navigator
const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name='MainStackHome'
          component={Home}
          options={{headerShown: false}}
        />
      </>
    </Stack.Navigator>
  );
};


// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeStackHome"
        component={Home}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};


// Profile stack navigator
const ProfileStackNavigator = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name='ProfileView'
            component={Profile}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name='ModifyProfile'
            component={ModifyProfile}
          />
        </>
      ) : (
        <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};


const Navigator = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default Navigator;
