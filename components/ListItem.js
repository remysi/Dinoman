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

  const doDelete = () => {
    Alert.alert('Deleting a file', 'Are you sure', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const token = await AsyncStorage.getItem('userToken');
          await deleteMedia(token, singleMedia.file_id);
          setUpdate(!update);
        },
      },
    ]);
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
          <Text>{itemAge}</Text>
          <Text>{itemCategory}</Text>
          <Text>{itemCondition}</Text>
        </ReListItem.Subtitle>
        {singleMedia.user_id === user.user_id && (
          <ButtonGroup
            buttons={['Modify', 'Delete']}
            onPress={async (index) => {
              if (index === 0) {
                navigation.navigate('ModifyFile', singleMedia);
              } else {
                // TODO: delete the file
                doDelete();
              }
            }}
          />
        )}
      </ReListItem.Content>

      <Button
        title="View"
        onPress={() => {
          navigation.navigate('Single', singleMedia);
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
