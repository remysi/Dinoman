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

const FeaturedAuctionItem = ({singleMedia, navigation}) => {

  // Captures the information from the poster
  const {user} = useContext(MainContext);

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
        <ListItem.Title numberOfLines={1} h4>
          {singleMedia.title}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={10}>
          {singleMedia.description}
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
