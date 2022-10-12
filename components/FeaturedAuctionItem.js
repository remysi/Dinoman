import PropTypes from 'prop-types';
//import {vh} from 'react-native-expo-viewport-units';
import {mediaUrl} from '../utils/variables';
import {
  ListItem,
  Avatar,
  ButtonGroup, Card,
} from '@rneui/themed';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const FeaturedAuctionItem = ({singleMedia, navigation}) => {

  // Captures the information from the poster
  const {user} = useContext(MainContext);

  // singleMedia.description contains all auction item data
  // all the data is captured into itemArray and parsed into itemObject
  const itemArray = singleMedia.description;
  const itemObject = JSON.parse(itemArray);

  console.log('myArray: ' + itemArray);

  return (
    <ListItem
      style={{flex: 1}}
      containerStyle={{backgroundColor: '#33312E'}}
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >

      <Avatar
        size='large'
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
      />

      <ListItem.Content>

        <ListItem.Title
          numberOfLines={1} h4
          style={{color: '#FCF6B1'}}>
          {singleMedia.title}
        </ListItem.Title>

        <ListItem.Subtitle
          style={{color: '#FCF6B1'}}
          numberOfLines={10}>
          {itemObject.description}
        </ListItem.Subtitle>

        <ListItem.Subtitle
          numberOfLines={1}
          style={{
            marginTop: 10,
            backgroundColor: '#FCF6B1',
            borderRadius: 15,
            padding: 5,
          }}>
          {itemObject.auctionPrice + '€'}
        </ListItem.Subtitle>

        <ListItem.Subtitle
          numberOfLines={2}
          style={{
            marginTop: 10,
            backgroundColor: '#FCF6B1',
            borderRadius:15,
            padding:5,
          }}>
          {'Auction ends: ' + itemObject.auctionTimer}
        </ListItem.Subtitle>

      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

FeaturedAuctionItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default FeaturedAuctionItem;
