import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useContext} from 'react';
import {Icon} from '@rneui/themed';
import {Entypo} from '@expo/vector-icons';

import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
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

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Hamburger navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dinoman"
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
          backgroundColor: '#FCF6B1',
        },
      }}
    >
      <Drawer.Screen
        name="Dinoman"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="home" size={25} color={'#33312E'} />
          ),
        }}
      />

      <Drawer.Screen
        name="Main Auction"
        component={MainAuctionStackNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Entypo name="shop" size={25} color={'#33312E'} />
          ),
        }}
      />

      <Drawer.Screen
        name="Bid History"
        component={BidStackNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Entypo name="list" size={25} color={'#33312E'} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Icon name="account-circle" size={25} color={'#33312E'} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Tab navigator with stacks
const TabNavigator = () => {
  //const {isLoggedIn} = useContext(MainContext);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FCF6B1',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home" size={30} color={'#33312E'} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Main Auction"
        component={MainAuctionStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="shop" size={28} color={'#33312E'} />
          ),
          headerTitleAlign: 'center',
        }}
      />

      <Tab.Screen
        name="Bid History"
        component={BidStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Entypo name="list" size={30} color={'#33312E'} />
          ),
          headerTitleAlign: 'center',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="account-circle" size={30} color={'#33312E'} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={Home}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Single" component={Single} />

      <Stack.Screen name="SellerProfile" component={SellerProfile} />
    </Stack.Navigator>
  );
};

// MainAuction stack navigator
const MainAuctionStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={MainAuction}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Single" component={Single} />

      <Stack.Screen name="SellerProfile" component={SellerProfile} />
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
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

// Main stack navigator
const BidStackNavigator = () => {
  return (
    <Stack.Navigator>
      <>
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
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default Navigator;
