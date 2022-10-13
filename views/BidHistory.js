import PropTypes from 'prop-types';
import {useContext} from 'react';
import {StyleSheet, View, Platform, SafeAreaView} from 'react-native';

import BidList from '../components/BidList';
import {MainContext} from '../contexts/MainContext';

const BidHistory = ({navigation}) => {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <BidList navigation={navigation} />
    </SafeAreaView>
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
