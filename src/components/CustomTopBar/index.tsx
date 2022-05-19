import React from 'react';
import { View, Text, Image, Platform, StyleSheet, Alert } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';
import PlatformTouchable from '../../elements/PlatformButton';
import { connect } from 'react-redux';
import _ from 'lodash';
import { revoke } from 'react-native-app-auth';
import config from '../../config';
import { store } from '../../store';
import { startLogin } from '../../..';
import { Navigation } from 'react-native-navigation';

const isIOS = Platform.OS === 'ios';

type CustomTopBarProps = {
  canBack?: boolean;
  avatar?: string;
  titleCustom?: string;
  componentId?: any;
};

const CustomTopBar: React.FC<CustomTopBarProps> = props => {
  const { canBack, auth, titleCustom } = props;
  const user = auth.users || {};
  const uri = _.get(
    user,
    'picture',
    'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
  );
  const name = _.get(user, 'name', '');

  const _logOut = async () => {
    await revoke(config.configAppAuth, {
      tokenToRevoke: auth.accessToken,
      sendClientId: true,
    });
    store.dispatch({ type: 'auth/logout' });
    startLogin();
  };
  return (
    <View style={styles.topBarWrapper}>
      <View style={styles.row}>
        {canBack && (
          <PlatformTouchable
            onPress={() => {
              Navigation.pop(props.componentId);
            }}>
            <IonIcons name="arrow-back-outline" style={styles.backBtn} />
          </PlatformTouchable>
        )}
        {!canBack && (
          <Image
            source={{
              uri,
            }}
            style={styles.avatar}
          />
        )}
        <Text style={styles.title}>{titleCustom || name}</Text>
      </View>
      {!canBack && (
        <PlatformTouchable
          onPress={() => {
            Alert.alert('Confirm logout?', 'Do you want logout?', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => _logOut(),
              },
            ]);
          }}>
          <IonIcons
            name="exit-outline"
            style={{ fontSize: 24, color: '#000' }}
          />
        </PlatformTouchable>
      )}
    </View>
  );
};

export default connect(_ => ({ auth: _.auth }))(CustomTopBar);
const styles = StyleSheet.create({
  topBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: isIOS ? 40 : 56,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#bdbdbd',
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    fontSize: 24,
    color: colors.grey,
  },
  avatar: {
    width: isIOS ? 30 : 40,
    height: isIOS ? 30 : 40,
    borderRadius: isIOS ? 15 : 20,
    resizeMode: 'contain',
  },
  title: {
    color: 'black',
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '600',
  },
});
