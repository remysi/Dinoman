import PropTypes from 'prop-types';
import { useContext } from 'react';
import {StyleSheet, View, Platform} from 'react-native';

import List from '../components/BidList';
import { MainContext } from '../contexts/MainContext';

const BidHistory = ({navigation}) => {
  return (
    <View style={styles.droidSafeArea}>
      <List navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});

BidHistory.propTypes = {
  navigation: PropTypes.object,
};

export default BidHistory;
