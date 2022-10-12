import PropTypes from 'prop-types';
import {Platform, SafeAreaView} from 'react-native';
import AuctionList from '../components/AuctionList';
import styleSheet from 'react-native-web/src/exports/StyleSheet';

// Navigation in the home function if there is problems with nav
const MainAuction = (props) => {
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
    backgroundColor: '#8A8D91',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
});

MainAuction.propTypes = {
  navigation: PropTypes.object,
};

export default MainAuction;
