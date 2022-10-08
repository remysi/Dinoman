import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {Icon} from '@rneui/themed';
import {Entypo} from '@expo/vector-icons';

import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import ModifyProfile from '../views/ModifyProfile';
import Single from '../views/Single';
import MainAuction from '../views/MainAuction';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dinoman"
        component={Home}
        options={{
          tabBarIcon: ({color}) =>
            <Icon
              name="home"
              size={30}
              color={color}
            />,
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Main Auction"
        component={MainAuction}
        options={{
          tabBarIcon: ({color}) =>
            <Entypo
              name="shop"
              size={30}
              color={color}
            />,
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={StackScreen}
        options={{
          tabBarIcon: ({color}) =>
            <Icon
              name="account-circle"
              size={30}
              color={color}
            />,
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
{/*      <Stack.Screen
        name='Single'
        component={Single}
      />*/}
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Back"
            component={Profile}
            options={{headerShown: false}}
          />
          <Stack.Screen name="ModifyProfile" component={ModifyProfile} />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Dinoman'}}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <TabScreen />
    </NavigationContainer>
  );
};

export default Navigator;
