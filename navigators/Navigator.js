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
import Single from '../views/Single';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  const {isLoggedIn} = useContext(MainContext);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{tabBarIcon: ({color}) => <Icon name="home" color={color} />}}
      />
      {isLoggedIn ? (
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="account-circle" color={color} />
            ),
          }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Dinoman'}}
        />
      )}
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  // const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name="Back"
          component={TabScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ModifyProfile" component={ModifyProfile} />
        <Stack.Screen name="Upload" component={Upload} />
        <Stack.Screen name="Single" component={Single} />
      </>
    </Stack.Navigator>
  );
};

/*
const SingleScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Single" component={Single} />
    </Tab.Navigator>
  );
};
*/

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;

/*
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
          <Stack.Screen name="Single" component={Single} />
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


const SingleScreen = () => {
  return (
    <>
      <SingleScreen name="Single" component={Single} />
    </>
  );
};
*/
