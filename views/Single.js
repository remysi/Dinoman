/* eslint-disable camelcase */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from '@rneui/themed';
import {Video} from 'expo-av';
import {ActivityIndicator, ScrollView} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
// import DateCountdown from 'react-date-countdown-timer';

const Single = ({route}) => {
  console.log('Single route', route);
  const {filename, title, description, user_id, media_type} = route.params;
  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('https://placekitten.com/160');
  const [username, setUserName] = useState(null);
  const {getFilesByTag} = useTag();
  const {getUserById} = useUser();

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
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Text>{username}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
