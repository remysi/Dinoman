import {View} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Card} from '@rneui/themed';

const Login = ({navigation}) => {
  // props is needed for navigation
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();
  const [showRegForm, setShowRegForm] = useState(false);

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken != null) {
        const userData = await getUserByToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
      }
    } catch (error) {
      // token invalid on server side
      console.error('Login - checkToken', error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Card>
      <View>
        {showRegForm ? <RegisterForm /> : <LoginForm />}
        <Button
          color={'#33312E'}
          title={showRegForm ? 'Back to sign in' : 'Register a new account'}
          onPress={() => {
            setShowRegForm(!showRegForm);
          }}
        ></Button>
      </View>
    </Card>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
