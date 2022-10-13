/* eslint-disable camelcase */
import React, {useContext, useEffect, useState, useRef} from 'react';
import {Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import PropTypes from 'prop-types';
import {mediaUrl, applicationTag} from '../utils/variables';
import {Avatar, Button, Card, Input, ListItem, Text} from '@rneui/themed';
import {Video} from 'expo-av';
import {ActivityIndicator, ScrollView} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTag, useUser, useComment} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountDown from 'react-native-countdown-component';
import {MainContext} from '../contexts/MainContext';

const Single = ({navigation, route, sellerInfo}) => {
  console.log('Single route', route);
  const {filename, title, description, user_id, media_type, file_id} =
    route.params;

  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState(
    'https://users.metropolia.fi/~jannhakk/Web-pohjaiset-sovellukset/Dinoman/dinomanPropic.jpg'
  );
  const [username, setUserName] = useState(null);
  const {getFilesByTag, postTag} = useTag();
  const {getUserById} = useUser();
  // For bidding
  const {update, setUpdate} = useContext(MainContext);
  const {postBid, getCommentByFile} = useComment();
  const {control, handleSubmit} = useForm({
    defaultValues: {file_id: file_id, comment: ''},
  });

  const bid = async (biddedAmount) => {
    console.log(
      'bidded comment amount',
      biddedAmount.comment,
      'what is highest bid',
      highestBid
    );
    if (Number(biddedAmount.comment) > Number(highestBid)) {
      console.log('Bid not high enough');
      try {
        console.log('bidded amount', biddedAmount);
        const token = await AsyncStorage.getItem('userToken');
        const bidResult = await postBid(token, biddedAmount);
        console.log('bid successfull', bidResult);

        Alert.alert('Bid successfull'.message, 'Bid successfull', [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(!update);
            },
          },
        ]);
      } catch (error) {
        console.error('Biddingform  error', error);
      }
    } else {
      Alert.alert(
        'Bid unsuccessfull'.message,
        'Bid unsuccessfull. Your bid was too low',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(!update);
            },
          },
        ]
      );
    }
  };

  const getHighestBid = async () => {
    console.log('total duration', totalDuration);
    try {
      const bid = await getCommentByFile(file_id);
      const whatBid = bid.pop();
      setHighestBid(whatBid.comment);
      console.log('What is the bid', whatBid);
      return whatBid;
    } catch (error) {
      console.error('getHighestbid error', error);
    }
  };

  // Countdown FOR NEW COUNTDOWN USEREF
  const ref = useRef(null);
  const [totalDuration, setTotalDuration] = useState(100);

  const allItemData = JSON.parse(description);
  const itemAge = allItemData.age;
  const itemDescription = allItemData.description;
  const itemCategory = allItemData.category;
  const itemCondition = allItemData.condition;
  const itemAuctionTimer = allItemData.auctionTimer;
  const itemAuctionPrice = allItemData.auctionPrice;

  const [highestBid, setHighestBid] = useState(itemAuctionPrice);

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
      setUserName(usernameArray.username);
      console.log(usernameArray.username);
      const sellerInfo = user_id;
      console.log('Seller info', sellerInfo);
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

  const countdownTimer = () => {
    const auctionEndDate = allItemData.auctionTimer;
    const fixedAuctionEndDate = auctionEndDate.split(' ').join('T') + '.000Z';

    // console.log('auction timer', auctionEndDate, 'fixed', fixedAuctionEndDate);

    const countdownEndDate = new Date(fixedAuctionEndDate);

    // console.log('endDate', countdownEndDate);

    const currentDate = new Date();
    // console.log('current date', currentDate);
    const timestampCurrentDate = currentDate.getTime();

    const timeLeft = countdownEndDate - timestampCurrentDate;

    const timeLeftSeconds = Math.floor(timeLeft / 1000 - 10800);

    setTotalDuration(timeLeftSeconds);

    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
    return {
      timeLeft,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    const {total, hours, minutes, seconds} = countdownTimer(e);
    if (total >= 0) {
      setTotalDuration(
        (hours > 9 ? hours : '0' + hours) +
          ':' +
          (minutes > 9 ? minutes : '0' + minutes) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    if (ref.current) clearInterval(ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    ref.current = id;
  };

  const getDeadTime = () => {
    const deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  const auctionEnding = async () => {
    try {
      const bid = await getCommentByFile(file_id);
      const whatBid = bid.pop();

      const token = await AsyncStorage.getItem('userToken');
      const tagAuctionSold = {
        file_id: file_id,
        tag: applicationTag + '_sold_' + whatBid.user_id,
      };
      const tagAuctionSoldResponse = await postTag(token, tagAuctionSold);

      console.log(
        'on auction end postTag',
        tagAuctionSold,
        'Auction sold tag',
        tagAuctionSoldResponse
      );

      Alert.alert('Auction has ended');
    } catch (error) {
      return console.error('auctionEnding failed', error);
    }
  };

  useEffect(() => {
    countdownTimer();
    getHighestBid();
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
  }, []);

  return (
    <ScrollView>
      <Card>
        <Card.Title>Item: {title}</Card.Title>
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
          <Text>Age: {itemAge} years</Text>
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
          <Text>Start price: {itemAuctionPrice}€</Text>
        </ListItem>
        <ListItem>
          <Text>Highest bid: {highestBid}€</Text>
        </ListItem>
        <ListItem>
          <Text>Auction timer: {itemAuctionTimer}</Text>
        </ListItem>
        <CountDown
          until={totalDuration}
          timetoShow={('H', 'M', 'S')}
          onFinish={auctionEnding}
          onPress={() => alert('hello', auctionEnding)}
          size={20}
        />

        <Controller
          control={control}
          rules={{
            value: /[0-9]{1,128}/,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              keyboardType="numeric"
              type="number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Bid amount"
            />
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

// NEW COUNTDOWN
/*
// If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    // setTotalDuration('00:00:00:10');
// update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    // This is where you need to adjust if
    // you entend to add more time
  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
      // setHighestBid(whatBid.comment);
    // Coundown timer for a given expiry date-time

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


    // Countdown
// const countdownEndDate = fixedAuctionEndDate.getTime();
    // const countdownEndDate = auctionEndDate.getTime();
    // const countdownEndDate = new Date(auctionEndDate);
    // const timeNow setInterval
    // const timestampEndDate = countdownEndDate.getTime();
    // const timestampEndDate = auctionEndDate.getTime();
    // console.log('End date timestamp', timestampEndDate);
    // const erDate = Date(fixedAuctionEndDate);
    //  console.log('erDate', erDate);
    // const timestampErDate = await erDate.getTime();
    // console.log('timestamp', timestampErDate);

    // Countdown
    // console.log('Current day timestamp', timestampCurrentDate);
    // const timeLeft = timestampEndDate - timestampCurrentDate;
    // console.log('timeleft timestamp', timeLeft);
    // console.log('temeleft', timeLeftSeconds);
    // Settign up the duration of countdown
    // New countdown timer

    // const total = Date.parse(allItemData.auctionTimer) - Date.parse(new Date());
    // const seconds = Math.floor((total / 1000) % 60);
    // const minutes = Math.floor((total / 1000 / 60) % 60);
    // const hours = Math.floor((total / 1000 / 60 / 60) % 24);
 // (await allItemData.auctionTimer) || '2022-10-11 11:28:00';
    // console.log('auction timer', allItemData.auctionTimer);


  const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
      countDownDate - new Date().getTime()
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
      }, 1000);

      return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
  };

  const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };

  const CountdownTimer = ({targetDate}) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
      return <ExpiredNotice />;
    } else {
      return (
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  };
*/
// NEW COUNTDOWN ENDS
