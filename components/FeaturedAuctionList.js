import {FlatList, Platform} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import FeaturedAuctionItem from './FeaturedAuctionItem';
import {Card} from '@rneui/themed';
import styleSheet from 'react-native-web/src/exports/StyleSheet';

const FeaturedAuctionList = ({navigation}) => {
  //const {update} = useContext(MainContext);
  // inside useMedia below: update, myFilesOnly
  const {mediaArray} = useMedia();

  return (

    <Card containerStyle={styles.list}>
      <Card.Title
        h3
        style={styles.title}
      >Newest Auctions
      </Card.Title>

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
    </Card>
  );
};

const styles = styleSheet.create({
  title: {
    color: '#FCF6B1',
    marginBottom: 20,
    borderBottomStyle: 'solid',
    borderBottomColor: '#8A8D91',
    borderBottomWidth: 5,
  },
  list: {
    backgroundColor: 'rgba(51, 49, 46, 0.8)',
    borderColor: 'rgba(51, 49, 46, 0)',
    borderRadius: 10,
    padding: 20,}
});

FeaturedAuctionList.propTypes = {
  navigation: PropTypes.object,
};

export default FeaturedAuctionList;
