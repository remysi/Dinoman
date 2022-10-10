/* eslint-disable camelcase */
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {Avatar, Button, Card, Icon, ListItem, Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import sellerInfo from '../views/Single';

const Profile = ({navigation, route}) => {
  console.log('Profile route', route);

  const {user_id} = route.params.params;

  const {isLoggedIn, user} = useContext(MainContext);
  // const [avatar, setAvatar] = useState('https://placekitten.com/640');
  // const {getFilesByTag} = useTag();

  // const {filename, title, description, user_id, media_type} = route.params;
  const [username, setUserName] = useState(null);
  const {getUserById} = useUser();

  console.log('SellerProfile info', user_id);

  const stuff = sellerInfo;
  console.log('stuff', stuff);

  /*
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
  */
  console.log('fetuser ded', user_id);

  const fetchUserName = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const usernameArray = await getUserById(token, user_id);
      console.log('fetuser ded', user_id);
      // const userIdName = usernameArray.pop();
      setUserName(usernameArray.username);
      console.log(usernameArray.username);
      // console.log('avatarArray', mediaUrl, avatarFile.filename);
    } catch (error) {
      console.error('fetchUsername', error.message);
    }
  };

  useEffect(() => {
    // fetchAvatar();
    fetchUserName();
  }, []);

  console.log('Profile', isLoggedIn);

  return (
    <Card>
      <Card.Title>Full name: {user.full_name}</Card.Title>
      <Card.Image source={{uri: 'https://placekitten.com/640'}} />
      <ListItem>
        <Avatar
          icon={{name: 'contact-mail', type: 'material'}}
          containerStyle={{backgroundColor: 'darkred'}}
        />
        <Text> {user.email}</Text>
      </ListItem>
      <ListItem>
        <Icon name="person" />
        <Text>User: {username}</Text>
      </ListItem>

      <Button
        title="Chat"
        onPress={() => {
          navigation.navigate('Upload', user);
        }}
      />
    </Card>
  );
};

Profile.propTypes = {
  route: PropTypes.object,

  navigation: PropTypes.object,
};

export default Profile;
