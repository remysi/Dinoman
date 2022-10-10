import {FlatList} from 'react-native';
import {useMedia, useTag} from '../hooks/ApiHooks';
import ListItem from './BidListItem';
import PropTypes from 'prop-types';
import {useContext, useState, useEffect} from 'react';
import {MainContext} from '../contexts/MainContext';
import { applicationTag } from '../utils/variables';

const List = ({navigation, myFilesOnly}) => {
  const {update} = useContext(MainContext);
  const {mediaArray} = useMedia(update, myFilesOnly);
  const {getFilesByTag} = useTag();
  const [bidArray, setBidArray] = useState([]);
  
  
  const fetchBids = async () => {
    try {
      setBidArray( await getFilesByTag(applicationTag + 'bid'));
      mediaArray.map((file)=>{
        bidArray.map((bid)=>{
            if (file.file_id === bid.file_id) {
                file.bid = true;
            } else {
                file.bid = false;
            }
        });
      });
    } catch (error) {
      console.error('fethBids', error.message);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [mediaArray]);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem
          singleMedia={item}
          navigation={navigation}
          myFilesOnly={myFilesOnly}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
