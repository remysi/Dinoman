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
      <Card>
        <Card.Title h3>Newest Auctions</Card.Title>
      </Card>

      <Card>
        <FeaturedAuctionList navigation={navigation} />
      </Card>
    </SafeAreaView>
  );
};

const styles = styleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
