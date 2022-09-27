import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Alert} from 'react-native';
import {useContext, useState, useEffect} from 'react';
import {mediaUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';
import {Button, Card, Input} from '@rneui/themed';

const ModifyProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const {putUser} = useUser();

  const {user} = useContext(MainContext);
  const [setAvatar] = useState('https://placekitten.com/640');
  const {getFilesByTag} = useTag();

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      console.log('avatarArray', user, avatarArray);
      const avatarFile = avatarArray.pop();
      setAvatar(mediaUrl + avatarFile.filename);
    } catch (error) {
      console.error('fethAvatar', error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  const {control, handleSubmit} = useForm({
    defaultValues: {full_name: user.full_name},
  });

  const onSubmit = async (userData) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const modifyResponse = await putUser(token, userData);
      console.log('modify profile', modifyResponse);

      Alert.alert(modifyResponse.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            setUpdate(!update);
            // navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      return console.error('onSubmit modify profile failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 3,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Full name"
            autoCapitalize="words"
          />
        )}
        name="full_name"
      />

      <Button
        title="Update"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </Card>
  );
};

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyProfile;
