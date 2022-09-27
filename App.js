import {StatusBar} from 'expo-status-bar';
import {Keyboard, TouchableOpacity} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <MainProvider>
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={{flex: 1}}
            activeOpacity={1}
          >
            <Navigator></Navigator>
          </TouchableOpacity>
        </MainProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
