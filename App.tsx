/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Linking,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

WebBrowser.maybeCompleteAuthSession();

function App(): JSX.Element {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      '833805328094-tdcrc54rbsn7e64v62mmc4pifn0ipm1s.apps.googleusercontent.com',
    iosClientId:
      '833805328094-nkfje5g03al371h2u31v6laq1qkiio34.apps.googleusercontent.com',
    expoClientId:
      '833805328094-8k6ieqi9vgpadslfou3ptll84a7sebkq.apps.googleusercontent.com',
  });

  // test

  React.useEffect(() => {
    if (response?.type === 'success') {
      console.log('requestr', request);
      // const {id_token} = response.authentication?.accessToken;
      setAccessToken(response?.authentication?.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View>
          <Image
            source={{uri: userInfo.picture}}
            style={{width: 100, height: 100}}
          />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title={accessToken ? 'Get User Data' : 'Login'}
            onPress={
              accessToken
                ? getUserData
                : () => {
                    promptAsync({showInRecents: true});
                  }
            }
          />
          {showUserInfo()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
