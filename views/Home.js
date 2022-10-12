import PropTypes from 'prop-types';
import {Platform, SafeAreaView} from 'react-native';
import FeaturedAuctionList from '../components/FeaturedAuctionList';
import styleSheet from 'react-native-web/src/exports/StyleSheet';
import {Card} from '@rneui/themed';

// Navigation in the home function if there is problems with nav
const Home = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>

      <Card containerStyle={styles.title}>
        <Card.Title
          h3
          style={{color: '#FCF6B1',}}
        >
          Newest Auctions
        </Card.Title>
      </Card>

      <Card containerStyle={styles.list}>
        <FeaturedAuctionList navigation={navigation} />
      </Card>
    </SafeAreaView>
  );
};


const styles = styleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: '#8A8D91',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  title: {
    backgroundColor: '#33312E',
    borderColor: '#FCF6B1',
    borderRadius: 10,
  },
  list: {
    backgroundColor: '#33312E',
    borderColor: '#FCF6B1',
    borderRadius: 10,
    padding: 20,}
});


Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
