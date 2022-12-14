/* eslint-disable camelcase */
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {Avatar, Card, Icon, ListItem, Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import sellerInfo from '../views/Single';
import {ScrollView} from 'react-native';

const Profile = ({navigation, route}) => {
  console.log('Profile route', route);

  const {user_id} = route.params.params;

  const {isLoggedIn, user} = useContext(MainContext);
  const [setAvatar] = useState('https://placekitten.com/640');
  const {getFilesByTag} = useTag();

  // const {filename, title, description, user_id, media_type} = route.params;
  const [username, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);

  const {getUserById} = useUser();

  console.log('SellerProfile info', user_id);

  const stuff = sellerInfo;
  console.log('stuff', stuff);

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

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userArray = await getUserById(token, user_id);
      console.log('fetuser ded', user_id);
      // const userIdName = usernameArray.pop();
      setUserName(userArray.username);
      setUserFullName(userArray.full_name);
      setUserEmail(userArray.email);
      console.log(userArray.username);
      // console.log('avatarArray', mediaUrl, avatarFile.filename);
    } catch (error) {
      console.error('fetchUsername', error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
    fetchUserInfo();
  }, []);

  console.log('Profile', isLoggedIn);

  return (
    <ScrollView>
      <Card>
        <Card.Title>Seller: {userFullName}</Card.Title>
        <Card.Image
          source={{
            uri: 'https://users.metropolia.fi/~jannhakk/Web-pohjaiset-sovellukset/Dinoman/dinomanPropic.jpg',
          }}
        />
        <ListItem>
          <Avatar
            icon={{name: 'contact-mail', type: 'material'}}
            containerStyle={{backgroundColor: 'darkred'}}
          />
          <Text> {userEmail}</Text>
        </ListItem>
        <ListItem>
          <Icon name="person" />
          <Text>Username: {username}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

Profile.propTypes = {
  route: PropTypes.object,

  navigation: PropTypes.object,
};

export default Profile;
