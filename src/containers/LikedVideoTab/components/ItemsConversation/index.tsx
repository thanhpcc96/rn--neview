import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { Navigation } from 'react-native-navigation';

const { width } = Dimensions.get('screen');

const ItemConversion = props => {
  const { item } = props;
  console.log('item => ', item);
  const title = _.get(item, 'snippet.title', '');
  const channelTitle = _.get(item, 'snippet.channelTitle', '');
  const view = _.get(item, 'statistics.viewCount', '');
  const thumbnails = _.get(
    item,
    'snippet.thumbnails.default.url',
    'https://i.ytimg.com/img/no_thumbnail.jpg',
  );
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      style={styles.wrapper}
      onPress={() => {
        Navigation.push(props.componentId, {
          component: {
            name: 'videoDetail',
            passProps: {
              componentId: 'props.componentId',
              video: item,
            },
            options: {
              bottomTabs: {
                visible: false,
                drawBehind: true,
              },
            },
          },
        });
      }}>
      <Image
        source={{
          uri: thumbnails,
        }}
        style={styles.img}
      />
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Text style={{ color: 'black', fontSize: 13 }}>{title}</Text>
        <Text style={{ fontSize: 11, color: 'grey' }}>
          {channelTitle} - {view} view
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ItemConversion;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  img: {
    width: width * 0.3,
    height: width * 0.2,
    resizeMode: 'cover',
    backgroundColor: 'red',
  },
});
