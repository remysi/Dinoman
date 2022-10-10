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
import MainAuction from '../views/MainAuction';
import Upload from '../views/Upload';
import Single from '../views/Single';
import SellerProfile from '../views/SellerProfile';
import BidHistory from '../views/BidHistory';
import BuyItem from '../views/BuyItem';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  const {isLoggedIn} = useContext(MainContext);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dinoman"
        component={Home}
        options={{
          tabBarIcon: ({color}) => <Icon name="home" size={30} color={color} />,
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Main Auction"
        component={MainAuction}
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="shop" size={30} color={color} />
          ),
          headerTitleAlign: 'center',
        }}
      />
      {isLoggedIn ? (
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="account-circle" size={30} color={color} />
            ),
            headerTitleAlign: 'center',
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
        <Stack.Screen name="SellerProfile" component={SellerProfile} />
        <Stack.Screen name="BidHistory" component={BidHistory} />
        <Stack.Screen name="BuyItem" component={BuyItem} />
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
