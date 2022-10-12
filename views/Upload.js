import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Input, Button, Text} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Alert, ScrollView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {applicationTag} from '../utils/variables';
import SelectDropdown from 'react-native-select-dropdown';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const Upload = ({navigation}) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const [item, setItem] = useState({});
  // For date/time selection
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState('Empty');
  const [mode, setMode] = useState('date');

  // Show Clock
  const [showClock, setShowClock] = useState(false);

  // Date OnChange
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowClock(false);
    setDate(currentDate);

    const tempDate = new Date(currentDate);
    const selectedAuctionDate =
      tempDate.getFullYear() +
      '-' +
      (tempDate.getMonth() + 1) +
      '-' +
      tempDate.getDate();
    const selectedAuctionTime =
      tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + '00';
    setDateText(selectedAuctionDate + '\n' + selectedAuctionTime);

    console.log(
      'Selected date',
      selectedAuctionDate,
      'Selected time',
      selectedAuctionTime
    );
    setItem((item) => {
      return {
        ...item,
        auctionTimer: selectedAuctionDate + ' ' + selectedAuctionTime,
      };
    });
  };

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

    const allItemData = {
      description: data.description,
      shortDescription: data.shortDescription,
      age: data.age,
      condition: item.condition,
      category: item.category,
      auctionTimer: item.auctionTimer,
      auctionPrice: data.startPrice,
    };
    formData.append('description', JSON.stringify(allItemData));
    const filename = mediaFile.split('/').pop();
    let extension = filename.split('.').pop();
    extension = extension === 'jpg' ? 'jpeg' : extension;
    formData.append('file', {
      uri: mediaFile,
      name: filename,
      type: mediaType + '/' + extension,
    });
    console.log('data', allItemData);
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const uploadResponse = await postMedia(token, formData);
      console.log('upload response', uploadResponse);
      const tag = {file_id: uploadResponse.file_id, tag: applicationTag};
      const tagResponse = await postTag(token, tag);
      const tagCategory = {
        file_id: uploadResponse.file_id,
        tag: applicationTag + '' + item.category,
      };
      const tagCategoryResponse = await postTag(token, tagCategory);
      console.log(
        'onSubmit postTag',
        tagResponse,
        'CategoryTag',
        tagCategoryResponse
      );

      Alert.alert(uploadResponse.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            resetForm();
            setUpdate(!update);
            navigation.navigate('Dinoman');
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

  const itemCondition = ['Perfect', 'Great', 'Good', 'Fair', 'Broken'];

  const itemCategory = [
    'Clock',
    'Weapon',
    'Furniture',
    'Art',
    'Rome',
    'Other',
    'Jewel',
    'Coin',
  ];

  // Show clock
  const showClockMode = (currentMode) => {
    setShowClock(true);
    setMode(currentMode);
  };

  console.log(item);
  return (
    <ScrollView>
      <Card>
        <Card.Image
          source={{
            uri:
              mediaFile ||
              'https://users.metropolia.fi/~jannhakk/Web-pohjaiset-sovellukset/Dinoman/dinomanAucItem.jpg',
          }}
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
              placeholder="Auction item name"
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
          rules={{
            required: true,
            minLength: 3,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Full description"
            />
          )}
          name="description"
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
              placeholder="Shorter Description"
            />
          )}
          name="shortDescription"
        />
        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 1,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Item age"
            />
          )}
          name="age"
        />

        <Controller
          control={control}
          rules={{
            required: true,
            minLength: 3,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Auction start price"
            />
          )}
          name="startPrice"
        />

        <Button
          title="Set auction end date"
          onPress={() => showClockMode('date')}
        />
        <Button
          title="Set auction end time"
          onPress={() => showClockMode('time')}
        />

        {showClock && (
          <RNDateTimePicker
            value={date}
            is24Hour={true}
            mode={mode}
            display="default"
            onChange={onChangeDate}
            name="auctionTimer"
          />
        )}

        <Text>{dateText}</Text>
        <>
          <SelectDropdown
            data={itemCondition}
            defaultButtonText="Item condition"
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              console.log(selectedItem);
              setItem((item) => {
                return {...item, condition: selectedItem};
              });
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            getSelectedValue={(selectedItem, value) => {
              value = selectedItem;
              console.log(value);
              return value;
            }}
          />
        </>

        <SelectDropdown
          data={itemCategory}
          defaultButtonText="Item category"
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setItem((item) => {
              return {...item, category: selectedItem};
            });
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          name="category"
        />
        <Button title="Select item picture" onPress={pickImage} />
        <Button title="Reset form" onPress={resetForm} />
        <Button
          title="Upload item to auction"
          disabled={!mediaFile}
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>
    </ScrollView>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;

/*
   // DateTimePickerAndroid.open(params: AndroidNativeProps)
  // DateTimePickerAndroid.dismiss(mode: AndroidNativeProps['mode'])
  const hiddenClock = () => {
    let hiddenClockValue;
    if (!hiddenClockValue) {
      !hiddenClockValue;
      console.log(hiddenClockValue);
    }
  };
  */

// setDate = (event, date) => {};
