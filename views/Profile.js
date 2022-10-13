import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag} from '../hooks/ApiHooks';
import {mediaUrl} from '../utils/variables';
import {Avatar, Button, Card, Icon, ListItem, Text} from '@rneui/themed';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native-web';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState(
    'https://users.metropolia.fi/~jannhakk/Web-pohjaiset-sovellukset/Dinoman/dinomanPropic.jpg'
  );
  const {getFilesByTag} = useTag();

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

  useEffect(() => {
    fetchAvatar();
  }, []);

  console.log('Profile', isLoggedIn);

  const logOut = async () => {
    try {
      setIsLoggedIn(false);
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Profile - logout', error);
    }
  };

  return (
    <Card containerStyle={styles.Card}>
      <Card.Title>Full name: {user.full_name}</Card.Title>
      <Card.Image source={{uri: avatar}} />
      <ListItem style={styles.List}>
        <Avatar
          icon={{name: 'contact-mail', type: 'material'}}
          containerStyle={{backgroundColor: 'darkred'}}
        />
        <Text> {user.email}</Text>
      </ListItem>
      <ListItem containerstyle={styles.List}>
        <Icon name="person" />
        <Text>
          User: {user.username} (id: {user.user_id})
        </Text>
      </ListItem>
      <Button color={'#33312E'} title="Logout" onPress={logOut} />

      <Button
        color={'#33312E'}
        title="Update"
        onPress={() => {
          navigation.navigate('ModifyProfile', user);
        }}
      />
      <Button
        color={'#33312E'}
        title="Add item to auction"
        onPress={() => {
          navigation.navigate('Upload', user);
        }}
      />
      <Button
        color={'#33312E'}
        title="Bid History"
        onPress={() => {
          navigation.navigate('BidHistory', user);
        }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  Card: {
    flex: 1,
    //backgroundColor: '#8A8D91',
    paddingTop: Platform.OS === 'android' ? 5 : 0,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
