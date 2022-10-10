/* eslint-disable camelcase */
import React, {useContext, useEffect, useState, useRef} from 'react';
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
  ExpiredNotice,
  ShowCounter,
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
  const {getFilesByTag, postTag} = useTag();
  const {getUserById} = useUser();
  // For bidding
  // const {update, setUpdate} = useContext(MainContext);

  const {postBid, getCommentByFile} = useComment();
  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
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

  // const allBids = JSON.parse(comment);
  // const oneBid = allBids.comment;
  // console.log('bidd?', oneBid);

  const getHighestBid = async () => {
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

  // For seller profile
  // const {user} = useContext(MainContext);

  // Fix for countdown

  // Countdown FOR NEW COUNTDOWN USEREF
  const ref = useRef(null);
  const [totalDuration, setTotalDuration] = useState(10);

  const allItemData = JSON.parse(description);
  const itemAge = allItemData.age;
  const itemDescription = allItemData.description;
  const itemShortDescription = allItemData.shortDescription;
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

  const countdownTimer = async (e) => {
    // Countdown
    const auctionEndDate =
      (await allItemData.auctionTimer) || '2022-10-11 11:28:00';

    const countdownEndDate = new Date(auctionEndDate);
    // console.log('endDate', auctionEndDate);
    // const timeNow setInterval
    const timestampEndDate = countdownEndDate.getTime();
    // console.log('End date timestamp', timestampEndDate);

    const currentDate = new Date();
    const timestampCurrentDate = currentDate.getTime();
    // console.log('Current day timestamp', timestampCurrentDate);

    const timeLeft = timestampEndDate - timestampCurrentDate;
    // console.log('timeleft timestamp', timeLeft);

    // const timeLeftSeconds = Math.floor(timeLeft / 1000);
    // console.log('temeleft', timeLeftSeconds);
    // Settign up the duration of countdown
    // setTotalDuration(timeLeftSeconds);
    //  };

    // New countdown timer

    // const total = Date.parse(allItemData.auctionTimer) - Date.parse(new Date());
    // const seconds = Math.floor((total / 1000) % 60);
    // const minutes = Math.floor((total / 1000 / 60) % 60);
    // const hours = Math.floor((total / 1000 / 60 / 60) % 24);
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
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
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
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTotalDuration('00:00:00:10');

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (ref.current) clearInterval(ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    ref.current = id;
  };

  const getDeadTime = () => {
    const deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button

  const auctionEnding = async () => {
    try {
      const bid = await getCommentByFile(file_id);
      const whatBid = bid.pop();
      // setHighestBid(whatBid.comment);
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

  // NEW COUNTDOWN
  /*
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

  useEffect(() => {
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
    // countdownTimer();
    getHighestBid();
    fetchAvatar();
    fetchUserName();
    unlock();
    // auctionEnding();

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
          <Text>Highest bid: {highestBid}</Text>
        </ListItem>
        <ListItem>
          <Text>Auction timer: {itemAuctionTimer}</Text>
        </ListItem>
        <Text>{totalDuration}</Text>

        <CountDown
          until={totalDuration}
          // duration of countdown in seconds
          timetoShow={('H', 'M', 'S')}
          // formate to show
          onFinish={auctionEnding}
          // on Finish call
          onPress={() => alert('hello', auctionEnding)}
          // on Press call
          size={20}
        />

        <Controller
          control={control}
          rules={
            {
              // value: /[0-9]{1,128}/,
              /*
            validate: (value) => {
              if (value > highestBid) {
                return true;
              } else {
                return 'Your bid must be  higher';
              }
            },
            */
            }
          }
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              type="number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Bid amount"
            />
          )}
          name="comment"
        />
        <Button title="End" onPress={auctionEnding} />

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
