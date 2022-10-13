import PropTypes from 'prop-types';
import {Image, ImageBackground, Platform, SafeAreaView} from 'react-native';
import FeaturedAuctionList from '../components/FeaturedAuctionList';
import styleSheet from 'react-native-web/src/exports/StyleSheet';
import {Card} from '@rneui/themed';
import {useState, useEffect} from 'react';

// Navigation in the home function if there is problems with nav
const Home = (props) => {
  const {navigation} = props;

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <ImageBackground
        source={require('../media/coffeeMaker.jpg')}
        style={styles.image}
      >
        <FeaturedAuctionList navigation={navigation} />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = styleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: '#8A8D91',
    //backgroundImage: './media/coffeeMaker.jpg',
    paddingTop: Platform.OS === 'android' ? 5 : 0,
  },
  image: {
    width: null,
    height: null,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
