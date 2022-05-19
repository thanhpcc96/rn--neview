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
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { refresh } from 'react-native-app-auth';

import CustomTopBar from '../../components/CustomTopBar';
import { getInfoUser, getListVideoComment } from '../../config/request';
import ItemConversion from '../LikedVideoTab/components/ItemsConversation';
import config from '../../config';
import { store } from '../../store';
import { startLogin } from '../../..';
import { isIOS } from '../../utils/platformHelper';
import { Navigation } from 'react-native-navigation';

//@ts-ignore
@connect(_ => ({ auth: _.auth }), {})
class CommentedTab extends React.Component<any> {
  navigationEventListener: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      listVideo: [],
      nextPageToken: null,
      hasMore: false,
      isRefreshing: false,
    };
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }
  async componentDidAppear() {
    const token = await this._checkStatusLogin();
    //   console.log('token ==> ', this.props);

    await this._getData(token as any);
  }

  componentWillUnmount() {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }
  _getInfo = async (token: string) => {
    try {
      const userdata = await getInfoUser(token);

      store.dispatch({ type: 'auth/markLogin', data: { users: userdata } });
    } catch (error) {}
  };

  _getData = async (token: string, parrams = {}) => {
    try {
      const data = await getListVideoComment(token, parrams);

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
        const dataCommented = data.items.filter(
          (rd: any) => rd.snippet?.type == 'comment',
        );
        stateToSet.listVideo = [...this.state.listVideo, ...dataCommented];
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
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <CustomTopBar />
        <View style={styles.wrapper}>
          <View style={styles.noteWrap}>
            <Text style={styles.noteText}>
              Youtube Activity API deprecated can can not get Video Commented.
            </Text>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text style={{ color: '#464746' }}>Data Empty</Text>
              </View>
            )}
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
              return <ItemConversion item={item} />;
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: { flex: 1, backgroundColor: 'white' },
  noteWrap: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  noteText: { textAlign: 'center', color: 'white' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
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

export default CommentedTab;
