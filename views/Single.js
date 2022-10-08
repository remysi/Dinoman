/* eslint-disable camelcase */
import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {useForm, Controller} from 'react-hook-form';
import PropTypes from 'prop-types';
import {mediaUrl, applicationTag} from '../utils/variables';
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Input,
  ListItem,
  Text,
} from '@rneui/themed';
import {Video} from 'expo-av';
import {ActivityIndicator, ScrollView} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTag, useUser, useMedia, useComment} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDown from 'react-native-countdown-component';
import {MainContext} from '../contexts/MainContext';
// import DateCountdown from 'react-date-countdown-timer';

const Single = ({navigation, route, sellerInfo}) => {
  console.log('Single route', route);
  const {filename, title, description, user_id, media_type, file_id} =
    route.params;

  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('https://placekitten.com/160');
  const [username, setUserName] = useState(null);
  const {getFilesByTag} = useTag();
  const {getUserById} = useUser();
  // For bidding
  // const {update, setUpdate} = useContext(MainContext);

  const {postBid} = useComment();
  const {
    control,
    handleSubmit,
    // formState: {errors},
  } = useForm({
    defaultValues: {file_id: file_id, comment: ''},
    // mode: 'onBlur', file_id: file_id,
  });

  const bid = async (biddedAmount) => {
    console.log('bidded amount', biddedAmount);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const bidResult = await postBid(token, biddedAmount);
      console.log('bid successfull', bidResult);
      /*
      const tagBidded = {
        file_id: bidResult.file_id,
        tag: applicationTag,
      };
      const tagBiddedResponse = await postTag(token, tagBidded);
      console.log('onBid tagBidded', tagBiddedResponse);
      console.log('Bidding result', bidResult);
      */

      /*
      Alert.alert(bidResult.message, '', [
        {
          text: 'Ok',
          onPress: () => {
            // setUpdate(!update);
          },
        },
      ]);
      */
    } catch (error) {
      console.error('Biddingform  error', error);
    }
  };

  // For seller profile
  // const {user} = useContext(MainContext);

  // Fix for countdown

  // Countdown
  const [totalDuration, setTotalDuration] = useState(0);

  const allItemData = JSON.parse(description);
  const itemAge = allItemData.age;
  const itemDescription = allItemData.description;
  const itemShortDescription = allItemData.shortDescription;
  const itemCategory = allItemData.category;
  const itemCondition = allItemData.condition;
  const itemAuctionTimer = allItemData.auctionTimer;
  const itemAuctionPrice = allItemData.auctionPrice;

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user_id);
      const avatarFile = avatarArray.pop();
      setAvatar(mediaUrl + avatarFile.filename);
      console.log('avatarArray', mediaUrl, avatarFile.filename);
    } catch (error) {
      console.error('fetchAvatar', error.message);
    }
  };

  const fetchUserName = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const usernameArray = await getUserById(token, user_id);
      // const userIdName = usernameArray.pop();
      setUserName(usernameArray.username);
      console.log(usernameArray.username);
      const sellerInfo = user_id;
      console.log('Seller info', sellerInfo);
      // console.log('avatarArray', mediaUrl, avatarFile.filename);
    } catch (error) {
      console.error('fetchUsername', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      // no error needed
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      // no error needed
    }
  };

  const showFullscreenVideo = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.log('fs video', error);
    }
  };

  useEffect(() => {
    // Countdown
    const auctionEndDate = allItemData.auctionTimer;
    const countdownEndDate = new Date(auctionEndDate);

    const timestampEndDate = countdownEndDate.getTime();
    console.log('End date timestamp', timestampEndDate);

    const currentDate = new Date();
    const timestampCurrentDate = currentDate.getTime();
    console.log('Current day timestamp', timestampCurrentDate);

    const timeLeft = timestampEndDate - timestampCurrentDate;
    console.log('timeleft timestamp', timeLeft);

    const timeLeftSeconds = Math.floor(timeLeft / 1000);
    // Settign up the duration of countdown
    setTotalDuration(timeLeftSeconds);
    // Coundown timer for a given expiry date-time
    /*
    const date = moment().utcOffset('+05:30').format('YYYY-MM-DD hh:mm:ss');

    // Getting the current date-time
    // You can set your own date-time
    const expirydate = '2023-12-23 04:00:45';

    const diffr = moment.duration(moment(expirydate).diff(moment(date)));
    // Difference of the expiry date-time
    const hours = parseInt(diffr.asHours());
    const minutes = parseInt(diffr.minutes());
    const seconds = parseInt(diffr.seconds());

    // Converting in seconds
    const d = hours * 60 * 60 + minutes * 60 + seconds;

    // Settign up the duration of countdown
    // setTotalDuration(d);
    */

    // Countdown
    fetchAvatar();
    fetchUserName();
    unlock();
    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('Orientaatio', evt);
      if (evt.orientationInfo.orientation > 2) {
        // Show fullscreen video
        showFullscreenVideo();
      }
    });

    return () => {
      lock();
      ScreenOrientation.removeOrientationChangeListener(orientSub);
    };
  }, [videoRef]);

  return (
    <ScrollView>
      <Card>
        <Card.Title>Title: {title}</Card.Title>
        <Card.Divider />
        {media_type === 'image' ? (
          <Card.Image
            source={{uri: mediaUrl + filename}}
            PlaceholderContent={<ActivityIndicator />}
            style={{marginBottom: 12}}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: mediaUrl + filename}}
            style={{width: 300, height: 300}}
            onError={(error) => {
              console.log('Video error:', error);
            }}
            useNativeControls
            resizeMode="cover"
          />
        )}
        <Card.Divider />
        <ListItem>
          <Text>Age: {itemAge}</Text>
        </ListItem>
        <ListItem>
          <Text>Category: {itemCategory}</Text>
        </ListItem>
        <ListItem>
          <Text>Condition: {itemCondition}</Text>
        </ListItem>
        <ListItem>
          <Text>Description: {itemDescription}</Text>
        </ListItem>
        <ListItem>
          <Text>Short Description: {itemShortDescription}</Text>
        </ListItem>
        <ListItem>
          <Text>Auctionprice: {itemAuctionPrice}</Text>
        </ListItem>
        <ListItem>
          <Text>Auction timer: {itemAuctionTimer}</Text>
        </ListItem>
        <CountDown
          until={totalDuration}
          // duration of countdown in seconds
          timetoShow={('H', 'M', 'S')}
          // formate to show
          onFinish={() => alert('finished')}
          // on Finish call
          onPress={() => alert('hello')}
          // on Press call
          size={20}
        />
        <Controller
          control={control}
          render={({field: {onchange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onchange}
              value={value}
              placeholder="Bid amount"
            ></Input>
          )}
          name="comment"
        />

        <Button title="Bid" onPress={handleSubmit(bid)} />
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Button
            title={username}
            onPress={() => {
              navigation.navigate('SellerProfile', route, username, sellerInfo);
            }}
          />
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
  sellerInfo: PropTypes.string,
};

export default Single;
