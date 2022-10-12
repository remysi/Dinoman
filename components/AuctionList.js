import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import AuctionItem from './AuctionItem';

const AuctionList = ({navigation}) => {
  //const {update} = useContext(MainContext);
  // inside useMedia below: update, myFilesOnly
  const {mediaArray} = useMedia();

  return (
    <FlatList
      data={mediaArray.slice(0,30)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (

        <AuctionItem
          singleMedia={item}
          navigation={navigation}
        />
      )}
    />
  );
};

AuctionList.propTypes = {
  navigation: PropTypes.object,
};

export default AuctionList;
