import PropTypes from 'prop-types';
import {Platform, SafeAreaView} from 'react-native';
import AuctionList from '../components/AuctionList';
import styleSheet from 'react-native-web/src/exports/StyleSheet';

// Navigation in the home function if there is problems with nav
const Home = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <AuctionList navigation={navigation} />
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
