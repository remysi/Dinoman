import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Input, Button, Text} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {applicationTag} from '../utils/variables';

const Upload = ({navigation}) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {title: '', description: ''},
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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediaFile.split('/').pop();
    let extension = filename.split('.').pop();
    extension = extension === 'jpg' ? 'jpeg' : extension;
    formData.append('file', {
      uri: mediaFile,
      name: filename,
      type: mediaType + '/' + extension,
    });
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const uploadResponse = await postMedia(token, formData);
      console.log('upload response', uploadResponse);
      const tag = {file_id: uploadResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);
      console.log('onSubmit postTag', tagResponse);

      Alert.alert(uploadResponse.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            resetForm();
            setUpdate(!update);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      return console.error('onSubmit upload failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMediaFile(null);
    setMediaType(null);
    setValue('title', '');
    setValue('description', '');
  };

  return (
    <Card>
      <Card.Image source={{uri: mediaFile || 'https://placekitten.com/300'}} />
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
            placeholder="Title"
            autoCapitalize="words"
            errorMessage={
              (errors.title?.type === 'required' && (
                <Text>This is required.</Text>
              )) ||
              (errors.title?.type === 'minLength' && (
                <Text>Min 3 characters.</Text>
              ))
            }
          />
        )}
        name="title"
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Description"
          />
        )}
        name="description"
      />

      <Button title="Select media" onPress={pickImage} />
      <Button title="Reset" onPress={resetForm} />
      <Button
        title="Upload media"
        disabled={!mediaFile}
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </Card>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
