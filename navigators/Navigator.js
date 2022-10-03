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
    <Drawer.Navigator>
      <Drawer.Screen
        name='DrawerHome'
        component={TabNavigator}
      />
      <Drawer.Screen
        name='Profile'
        component={ProfileStackNavigator}
      />
    </Drawer.Navigator>
  );
};


// Hamburger navigator
/*const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      /!*initialRouteName='Home'
      drawerPosition='left'
      drawerType='slide'
      edgeWith={100}
      hideStatusBar={false}
      overlayColor='#0000000'
      drawerStyle={{
        backgroundColor:'#e6e6e6',
        width:250
      }}
      screenOptions={{
        headerShown: true,
        swipeEnabled: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'yellow',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}*!/
    >
      <Drawer.Screen
        // name='Home'
        component={TabNavigator}
        /!*options={{
          title:'Home view title',
          drawerIcon: ({color}) => <Icon
            name="home"
            color={color}
          />
        }}*!/
      />
      {/!*<Drawer.Screen
        name='Profile'
        component={ProfileStackNavigator}
        options={{
          title:'Profile view title',
          drawerIcon: ({color}) => <Icon
            name="account-circle"
            color={color}
          />
        }}
      />*!/}
{/!*      <Drawer.Screen
        name='Login'
        component={TabNavigator}
        options={{
          title:'Login view title',
          drawerIcon: ({color}) => <Icon
            name="login"
            color={color}
          />
        }}
      />*!/}
    </Drawer.Navigator>
  );
};*/


const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='TabHome'
        component={MainStackNavigator}
        //options={{tabBarIcon: ({color}) => <Icon name="home" color={color} />}}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileStackNavigator}
        /*        options={{
                  tabBarIcon: ({color}) => <Icon name="account-circle" color={color} />,
                }}*/
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
          name='MainHome'
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
        name="HomeHome"
        component={Home}
        //options={{headerShown: false}}
      />
      {/*<Stack.Screen name="ModifyProfile" component={ModifyProfile} />*/}
    </Stack.Navigator>
  );
};


// Profile stack navigator
const ProfileStackNavigator = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {/*{isLoggedIn ? (*/}
      <>
        <Stack.Screen
          name='Back'
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen name='ModifyProfile' component={ModifyProfile} />
      </>
      {/*      ) : (
        <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown: false}}
        />
      )}*/}
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
