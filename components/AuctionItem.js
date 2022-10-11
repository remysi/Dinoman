import PropTypes from 'prop-types';
//import {vh} from 'react-native-expo-viewport-units';
import {mediaUrl} from '../utils/variables';
import {
  ListItem,
  Avatar,
  ButtonGroup,
} from '@rneui/themed';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const AuctionItem = ({singleMedia, navigation}) => {

  // näin otetaan user tiedot postauksesta
  const {user} = useContext(MainContext);

  // singleMedia.description contains all auction item data
  // all the data is captured into itemArray and parsed into itemObject
  const itemArray = singleMedia.description;
  const itemObject = JSON.parse(itemArray);

  //console.log('myArray: ' + itemArray);

  return (
    <ListItem
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
        <ListItem.Title numberOfLines={2} h4>
          {singleMedia.title}
        </ListItem.Title>

        <ListItem.Subtitle numberOfLines={1}>
          {itemObject.shortDescription}
        </ListItem.Subtitle>

        <ListItem.Subtitle
          numberOfLines={1}
          style={{
            backgroundColor:'yellow',
            padding:7,
            borderStyle: 'solid',
            borderColor: '#000000',
            borderWidth: 2,
            borderRadius:15,
          }}
        >
          {itemObject.auctionPrice + '€'}

          {/* Checks is there is € already
          if ({itemObject.auctionPrice.slice(-1) === '€'}) {
          {itemObject.auctionPrice}
          } else {
          {itemObject.auctionPrice + '€'}}*/}
        </ListItem.Subtitle>

      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
};

AuctionItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default AuctionItem;
