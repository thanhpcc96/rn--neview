/** Xo8WBi6jzSxKDVR4drqm84yr9iU=
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import axios from 'axios';
import { authorize, prefetchConfiguration } from 'react-native-app-auth';
import configs from '../../config';
import Loading from '../../components/Loading';
import { store } from '../../store';
import { startTab } from '../../..';

class Login extends React.Component {
  state = {
    loading: false,
  };
  async componentDidMount() {
    try {
      await prefetchConfiguration(configs.configAppAuth);
    } catch (error) {
      console.log('error => ', error);
    }
  }

  _loginWithGoogleID = async () => {
    try {
      const authState = await authorize(configs.configAppAuth);
      console.log('clgt ? => ', authState);
      store.dispatch({
        type: 'auth/markLogin',
        data: {
          ...authState,
        },
      });
      startTab();
    } catch (e) {
      console.log('data rr => ', e);
    }
  };

  _getInfoUser = async (accessToken: string) => {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: 'Bearer ' + accessToken },
      },
    );
    return data;
  };
  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <View style={styles.wrapper}>
          <TouchableOpacity
            onPress={this._loginWithGoogleID}
            style={styles.btn}>
            <Text style={styles.txt}>Granting access to Youtube</Text>
          </TouchableOpacity>
        </View>
        {loading && <Loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '70%',
    backgroundColor: 'red',
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  txt: { fontWeight: '500', fontSize: 16 },
});

export default Login;
