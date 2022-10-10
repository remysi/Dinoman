import PropTypes from 'prop-types';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';


const Home = (props) => {
  return (
    <SafeAreaView style={styles.androidSafeArea}>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});


Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
