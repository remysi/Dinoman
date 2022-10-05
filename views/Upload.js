import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Input, Button, Text} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {useMedia, useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {Alert, Platform, ScrollView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useContext} from 'react';
import {applicationTag} from '../utils/variables';
import SelectDropdown from 'react-native-select-dropdown';
// import RNDateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
// import RNDateTimePicker from '@react-native-community/datetimepicker';

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
    setShowClock(Platform.OS === 'android');
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

  // DateTimePickerAndroid.open(params: AndroidNativeProps)
  // DateTimePickerAndroid.dismiss(mode: AndroidNativeProps['mode'])

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
      // auctionDate: date.auctionDate,
    };
    // formData.append('description', data.description);
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

  const itemCondition = ['Perfect', 'Great', 'Good', 'Fair', 'Broken'];

  const itemCategory = ['Clock', 'Weapon', 'Furniture', 'Art', 'Rome'];

  // Show clock
  const showClockMode = (currentMode) => {
    setShowClock(true);
    setMode(currentMode);
  };
  /*
  const hiddenClock = () => {
    let hiddenClockValue;
    if (!hiddenClockValue) {
      !hiddenClockValue;
      console.log(hiddenClockValue);
    }
  };
  */

  // setDate = (event, date) => {};
  console.log(item);
  return (
    <ScrollView>
      <Card>
        <Card.Image
          source={{uri: mediaFile || 'https://placekitten.com/300'}}
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
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Short Description"
            />
          )}
          name="shortDescription"
        />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Age"
            />
          )}
          name="age"
        />

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Starting Price"
            />
          )}
          name="startPrice"
        />

        <Button
          title="Set Auction date"
          onPress={() => showClockMode('date')}
        />
        <Button
          title="Set Auction time"
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
            defaultButtonText="Select condition"
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              // value = selectedItem;
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
          defaultButtonText="Select category"
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
        <Button title="Select media" onPress={pickImage} />
        <Button title="Reset" onPress={resetForm} />
        <Button
          title="Upload media"
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
