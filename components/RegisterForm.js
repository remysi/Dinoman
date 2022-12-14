import {useForm, Controller} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import {Input, Button, Text, Card} from '@rneui/themed';
import {Alert} from 'react-native';
import PropTypes from 'prop-types';
import Profile from '../views/Profile';

const RegisterForm = (navigation) => {
  const {checkUsername, postUser} = useUser();
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', email: '', password: '', full_name: ''},
    mode: 'onBlur',
  });

  const register = async (userData) => {
    delete userData.confirmPassword;

    console.log('register userData', userData);
    try {
      const result = await postUser(userData);
      console.log('registration result', result);

      Alert.alert(result.message, '', [
        {
          text: 'Ok',
          //  onPress: () => {
          //    navigation.navigate('Dinoman');
        },
        //  },
      ]);
    } catch (error) {
      console.error('RegisterForm  error', error);
    }
  };

  return (
    <Card>
      <Card.Title>Registration</Card.Title>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
          validate: async (value) => {
            const available = await checkUsername(value);
            return available ? true : 'Username already taken!';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Username"
            errorMessage={
              (errors.username?.type === 'required' && (
                <Text>This is required.</Text>
              )) ||
              (errors.username?.type === 'minLength' && (
                <Text>Min 3 characters.</Text>
              )) ||
              (errors.username?.type === 'validate' && (
                <Text>{errors.username.message}</Text>
              ))
            }
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          pattern: {
            value: /^[a-z0-9.]{1,128}@[a-z0-9.]{5,128}/i,
            message: 'Must be valid email',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            autoCapitalize="none"
            errorMessage={errors.email && <Text>{errors.email.message}</Text>}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 5, message: 'Min length 5 chars.'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            placeholder="Password"
            errorMessage={
              errors.password && <Text>{errors.password.message}</Text>
            }
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          validate: (value) => {
            if (value === getValues('password')) {
              return true;
            } else {
              return 'Passwords do not match';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={true}
            placeholder="Confirm password"
            errorMessage={
              errors.confirmPassword && (
                <Text>{errors.confirmPassword.message}</Text>
              )
            }
          />
        )}
        name="confirmPassword"
      />

      <Controller
        control={control}
        rules={{
          required: false,
          minLength: 3,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Full name"
          />
        )}
        name="full_name"
      />
      <Button color={'#33312E'} title="Register" onPress={handleSubmit(register)} />
    </Card>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
// onPress={(handleSubmit(register), navigation.navigate('SellerProfile');
