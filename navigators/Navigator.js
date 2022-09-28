import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {Icon} from '@rneui/themed';

import Home from '../views/Home';
import Profile from '../views/Profile';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import ModifyProfile from '../views/ModifyProfile';
import Upload from '../views/Upload';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{tabBarIcon: ({color}) => <Icon name="home" color={color} />}}
      />
      <Tab.Screen
        name="Profile"
        component={StackScreen}
        options={{
          tabBarIcon: ({color}) => <Icon name="account-circle" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Back"
            component={Profile}
            options={{headerShown: false}}
          />
          <Stack.Screen name="ModifyProfile" component={ModifyProfile} />
          <Stack.Screen name="Upload" component={Upload} />
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
