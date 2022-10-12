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
import {Alert, Platform, View} from 'react-native';
import styleSheet from 'react-native-web/src/exports/StyleSheet';

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
      containerStyle={styles.mainContainer}
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', singleMedia);
      }}
    >

      <View style={styles.leftContainer}>

        <Avatar
          size='large'
          source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
        />

        <ListItem.Subtitle
          numberOfLines={1}
          style={styles.auctionPrice}
        >
          {itemObject.auctionPrice + '€'}
        </ListItem.Subtitle>
      </View>

      <ListItem.Content style={styles.rightContainer}>

        <ListItem.Title
          numberOfLines={1} h4
          style={{color: '#FCF6B1'}}>
          {singleMedia.title}
        </ListItem.Title>

        <ListItem.Subtitle
          style={{color: '#FCF6B1'}}
          numberOfLines={7}>
          {itemObject.description}
        </ListItem.Subtitle>

        <ListItem.Subtitle
          numberOfLines={2}
          style={styles.auctionTimer}>
          {'Auction ends: ' + itemObject.auctionTimer}
        </ListItem.Subtitle>

      </ListItem.Content>

      <ListItem.Chevron />
    </ListItem>
  );
};

const styles = styleSheet.create({

  // Main containers.
  mainContainer: {
    backgroundColor: 'rgba(51, 49, 46, 0)',
    paddingBottom: 20,
  },
  leftContainer: {
    flex: 0.5,
  },
  rightContainer: {
    flex: 1,
  },

  // Left container stuff.
  auctionPrice: {
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#FCF6B1',
    borderRadius: 15,
    padding: 5,
  },

  // Right container stuff.
  auctionTimer: {
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#FCF6B1',
    borderRadius:15,
    padding:5,
  },
});

FeaturedAuctionItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default FeaturedAuctionItem;
