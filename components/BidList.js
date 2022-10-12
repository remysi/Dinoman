import {FlatList} from 'react-native';
import {useMedia, useTag} from '../hooks/ApiHooks';
import ListItem from './BidListItem';
import PropTypes from 'prop-types';
import {useContext, useState, useEffect} from 'react';
import {MainContext} from '../contexts/MainContext';
import {applicationTag} from '../utils/variables';

const List = ({navigation, history}) => {
  const {update, user} = useContext(MainContext);
  const {mediaArray} = useMedia(update);
  const {getFilesByTag} = useTag();
  const [bidArray, setBidArray] = useState([]);

  const fetchBids = async (history) => {
    try {
      if (history) {
        setBidArray(await getFilesByTag(applicationTag + user.user_id));
      } else {
        const result = await getFilesByTag(applicationTag + 'bought');
        const newArray = mediaArray.map((file) => {
          result.map((bid) => {
            if (file.file_id === bid.file_id) {
              file.bid = true;
            } else {
              file.bid = false;
            }
          });
        });
        setBidArray(newArray);
      }
    } catch (error) {
      console.error('fethBids', error.message);
    }
  };

  useEffect(() => {
    fetchBids(history);
  }, [mediaArray]);

  return (
    <>
      {bidArray.lenght > 0 && (
        <FlatList
          data={bidArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ListItem singleMedia={item} navigation={navigation} />
          )}
        />
      )}
    </>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  history: PropTypes.bool,
};

export default List;
