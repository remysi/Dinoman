import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import FeaturedAuctionItem from './FeaturedAuctionItem';
import {Card} from '@rneui/themed';

const FeaturedAuctionList = ({navigation}) => {
  //const {update} = useContext(MainContext);
  // inside useMedia below: update, myFilesOnly
  const {mediaArray} = useMedia();

  return (
    <FlatList
      data={mediaArray.slice(0,5)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (

        <FeaturedAuctionItem
          singleMedia={item}
          navigation={navigation}
        />
      )}
    />
  );
};

FeaturedAuctionList.propTypes = {
  navigation: PropTypes.object,
};

export default FeaturedAuctionList;