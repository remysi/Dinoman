import PropTypes from 'prop-types';
import {applicationTag, mediaUrl} from '../utils/variables';
import {
  ListItem as ReListItem,
  Avatar,
  Text,
  Button,
  ButtonGroup,
} from '@rneui/themed';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
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

  const {postTag} = useTag();

  const buyItem = async () => {
    try {
      const tag1 = {
        file_id: singleMedia.file_id,
        tag: applicationTag + 'bought',
      };
      const token = await AsyncStorage.getItem('userToken');
      const modifyResponse1 = await postTag(token, tag1);
      const tag2 = {
        file_id: singleMedia.file_id,
        tag: applicationTag + user.user_id,
      };
      const modifyResponse2 = await postTag(token, tag2);
      setUpdate(update + 1);
      Alert.alert('Payment', 'Payment complete', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } catch (error) {
      console.error('addTag', error.message);
    }
  };

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
      {!singleMedia.bid && <Button color={'#33312E'} title="Buy" onPress={buyItem} />}
    </ReListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
