import { Card, ListItem, Text } from '@rneui/base';
import PropTypes from 'prop-types';
import { useTag } from '../hooks/ApiHooks';

const {postTag} = useTag();

const onSubmit = async (userData) => {
  setIsLoading(true);
  try {
    const token = await AsyncStorage.getItem('userToken');
    const modifyResponse = await postTag(token, userData);
  } catch (error) {
    console.error('addTag', error.message);
  }
};

const BuyItem = ({navigation}) => {
  return (
    <Card>
      <Card.Title>Payment</Card.Title>
      <ListItem>
        <Text> Payment complite</Text>
      </ListItem>
    </Card>
    
  );
};

BuyItem.propTypes = {
  navigation: PropTypes.object,
};

export default BuyItem;
