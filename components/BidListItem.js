import PropTypes from 'prop-types';
import {mediaUrl} from '../utils/variables';
import {
  ListItem as ReListItem,
  Avatar,
  Text,
  Button,
  ButtonGroup,
} from '@rneui/themed';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

// Rneui theme
const ListItem = ({singleMedia, navigation, myFilesOnly}) => {
  console.log(singleMedia);
  const {user, update, setUpdate} = useContext(MainContext);
  const {deleteMedia} = useMedia();

  const allItemData = JSON.parse(singleMedia.description);
  const itemAge = allItemData.age;
  const itemCategory = allItemData.category;
  const itemCondition = allItemData.condition;

  return (
    <ReListItem bottomDivider>
      <Avatar
        source={{uri: mediaUrl + singleMedia.thumbnails.w160}}
        size="large"
      />

      <ReListItem.Content>
        <ReListItem.Title>
          <Text>{singleMedia.title}</Text>
        </ReListItem.Title>
        <ReListItem.Subtitle>
          <Text>{itemCategory}</Text>
        </ReListItem.Subtitle>
      </ReListItem.Content>

      <Button
        title="Buy"
        onPress={() => {
          navigation.navigate('BuyItem', singleMedia);
        }}
      />
    </ReListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
