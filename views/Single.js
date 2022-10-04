import {ScrollView, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import {Card, ListItem, Text, Avatar} from '@rneui/themed';
import FullSizeImage from '../components/FullSizeImage';
import {Video} from 'expo-av';
import {useEffect, useState} from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';


// contains the posted image, user id and profile picture of the poster.
const Single = ({route}) => {
  const {filename, title, description, user_id, media_type} = route.params;
  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('https://placekitten.com/160');
  const {getFilesByTag} = useTag();

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user_id);
      const avatarFile = avatarArray.pop();
      setAvatar(mediaUrl + avatarFile.filename);
      console.log('avatarArray', mediaUrl + avatarFile.filename);
    } catch (error) {
      console.error('fetchAvatar', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      // no error necessary
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      // no error necessary
    }
  };

  const showFullscreenVideo = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.log('showFullscreenVideo error: ', error);
    }
  };

  // Listens for screen orientation change
  useEffect(() => {
    fetchAvatar();
    fetchUserName();
    unlock();
    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      // different screen orientations have different values logged down below
      console.log('Orientation: ', evt);
      // checks which screen orientation is active
      if (evt.orientationInfo.orientation > 2)  {
       // show fullscreen video
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
        <Card.Title>{title}</Card.Title>
        <Card.Divider />
        {media_type === 'image' ? (
          <FullSizeImage
            source={{uri: mediaUrl + filename}}
            PlaceholderContent={<ActivityIndicator />}
            style={{marginBottom: 12}}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: mediaUrl + filename}}
            style={{width: 'auto', height: 300}}
            onError={(error) => {
              console.log('Video error: ', error);
            }}
            useNativeControls
            resizeMode='cover'
          />
        )}
        <Card.Divider />
        <ListItem>
          <Text>{description}</Text>
        </ListItem>
        <ListItem>
          <Avatar
            source={{uri: avatar}} />
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
