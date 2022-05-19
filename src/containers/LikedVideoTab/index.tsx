/**
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
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { refresh } from 'react-native-app-auth';

import CustomTopBar from '../../components/CustomTopBar';
import { getInfoUser, getListVideoLike } from '../../config/request';
import ItemConversion from './components/ItemsConversation';
import config from '../../config';
import { store } from '../../store';
import { startLogin } from '../../..';
import { isIOS } from '../../utils/platformHelper';

//@ts-ignore
@connect(_ => ({ auth: _.auth }), {})
class LikedVideoTab extends React.Component {
  state = {
    listVideo: [],
    nextPageToken: null,
    hasMore: false,
    isRefreshing: false,
  };
  async componentDidMount() {
    const token = await this._checkStatusLogin();
    console.log('token ==> ', this.props);

    await this._getData(token as any);
    await this._getInfo(token as any);

    // getListVideoLike(resutlt.accessToken);
    // console.log('proos', { props: this.props, resutlt });
  }

  _getInfo = async (token: string) => {
    try {
      const userdata = await getInfoUser(token);
      console.log('user => ', userdata);

      store.dispatch({ type: 'auth/markLogin', data: { users: userdata } });
    } catch (error) {}
  };

  _getData = async (token: string, parrams = {}) => {
    try {
      const data = await getListVideoLike(token, parrams);
      console.log('dta => ', data);

      const stateToSet: any = {
        isRefreshing: false,
      };
      if (data.nextPageToken) {
        stateToSet.nextPageToken = data.nextPageToken;
        stateToSet.hasMore = true;
      } else {
        stateToSet.nextPageToken = null;
        stateToSet.hasMore = false;
      }
      if (data.items) {
        stateToSet.listVideo = [...this.state.listVideo, ...data.items];
      }
      this.setState(stateToSet);
    } catch (error) {
      console.log('error ==> ', error);
    }
  };

  _fetchMore = async () => {
    const { hasMore, nextPageToken } = this.state;
    const token = await this._checkStatusLogin();
    if (hasMore) {
      await this._getData(token, {
        pageToken: nextPageToken,
      });
    }
  };

  _refresh = async () => {
    const token = await this._checkStatusLogin();
    this.setState({
      listVideo: [],
      nextPageToken: null,
      hasMore: false,
      isRefreshing: true,
    });
    await this._getData(token);
  };

  _checkStatusLogin = async () => {
    const { auth } = this.props;
    console.log('auth => ', auth);

    const now = Date.now();
    const expiredTime = new Date(auth.accessTokenExpirationDate).getTime();

    if (now >= expiredTime) {
      try {
        const resultRefesh = await refresh(config.configAppAuth, {
          refreshToken: auth.refreshToken,
        });
        console.log('refresh token againt => ', resultRefesh);
        store.dispatch({
          type: 'auth/markLogin',
          data: { ...resultRefesh, refreshToken: auth.refreshToken },
        });
        return resultRefesh.accessToken;
      } catch (e) {
        Alert.alert(
          'Session Expired.Please Relogin!',
          'Session Expired.Please Relogin!',
          [
            {
              text: 'Ok',
              onPress: () => {
                store.dispatch({ type: 'auth/logout' });
                startLogin();
              },
            },
          ],
        );
      }
    } else {
      return auth.accessToken;
    }
  };
  render() {
    const { listVideo, isRefreshing } = this.state;
    const { componentId } = this.props;

    return (
      <SafeAreaView style={{ backgroundColor: 'red', flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <CustomTopBar />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(it, id) => id.toString()}
            data={listVideo}
            onEndReachedThreshold={isIOS ? 0 : 1}
            onEndReached={() => this._fetchMore()}
            removeClippedSubviews
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this._refresh}
              />
            }
            renderItem={({ item }) => {
              return <ItemConversion item={item} componentId={componentId} />;
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default LikedVideoTab;
