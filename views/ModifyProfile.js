import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import {Alert, ScrollView, Text} from 'react-native';
import {useContext, useState, useEffect} from 'react';
import {mediaUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser, useMedia} from '../hooks/ApiHooks';
import {Button, Card, Input} from '@rneui/themed';

const ModifyProfile = () => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {putUser} = useUser();

  const {user} = useContext(MainContext);
  const [avatar, setAvatar] = useState(
    'https://users.metropolia.fi/~jannhakk/Web-pohjaiset-sovellukset/Dinoman/dinomanPropic.jpg'
  );
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

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: user.email,

      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log('file', result);

    if (!result.cancelled) {
      setMediaFile(result.uri);
      setMediaType(result.type);
    }
  };

  const onSubmit = async (userData, picData) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', 'profilepic');

    // formData.append('description', data.description);
    formData.append('description', ' ');
    let filename = mediaFile.split('/').pop();

    if (filename === null) {
      filename = avatar;
    }

    let extension = filename.split('.').pop();
    extension = extension === 'jpg' ? 'jpeg' : extension;
    formData.append('file', {
      uri: mediaFile,
      name: filename,
      type: mediaType + '/' + extension,
    });
    console.log('data', picData);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const uploadResponse = await postMedia(token, formData);
      console.log('upload response', uploadResponse);
      const tagPropic = {
        file_id: uploadResponse.file_id,
        tag: 'avatar_' + user.user_id,
      };
      const tagResponse = await postTag(token, tagPropic);

      console.log('onUpdate profile pic Tag', tagResponse);

      // const token = await AsyncStorage.getItem('userToken');
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
    <ScrollView>
      <Card>
        <Card.Image source={{uri: mediaFile || avatar}} />

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
        <Button title="Select profile picture" onPress={pickImage} />
        <Button
          title="Update profile"
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>
    </ScrollView>
  );
};

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyProfile;
