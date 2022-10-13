import {Card, ListItem, Text} from '@rneui/base';
import PropTypes from 'prop-types';
import {useTag} from '../hooks/ApiHooks';

const BuyItem = ({navigation}) => {
  return (
    <Card>
      <Card.Title>Payment</Card.Title>
      <ListItem>
        <Text> Payment complete</Text>
      </ListItem>
    </Card>
  );
};

BuyItem.propTypes = {
  navigation: PropTypes.object,
};

export default BuyItem;
