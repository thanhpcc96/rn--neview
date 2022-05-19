import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import _ from 'lodash';
import CustomTopBar from '../../components/CustomTopBar';
import WebView from 'react-native-webview';

const { width } = Dimensions.get('window');

export const VideoDetail = props => {
  const video = props.video;
  const title = _.get(video, 'snippet.title', '');
  const channelTitle = _.get(video, 'snippet.channelTitle', '');
  // const statistics = _.get(video, 'statistics', {});
  const uriVideo = `https://www.youtube.com/embed/${video.id}?rel=0&autoplay=0&showinfo=0&controls=0`;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <CustomTopBar
        canBack
        componentId={props.componentId}
        titleCustom={title.substr(0, 30) + '..'}
      />
      <View style={styles.wrapper}>
        <View style={{ width, height: width * 0.65 }}>
          <WebView
            source={{
              uri: uriVideo,
            }}
            javaScriptEnabled={true}
          />
        </View>
        <View style={{ flex: 1, marginTop: 16 }}>
          <Text style={styles.txtTitleVideo}>{title}</Text>

          <View style={styles.chanelWraper}>
            <Text style={styles.title}>{channelTitle}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
  },
  txtTitleVideo: { color: '#000', fontWeight: '500', marginHorizontal: 16 },
  titleVideo: { color: '#000', fontWeight: '500', marginHorizontal: 16 },
  wrapper: { flex: 1, backgroundColor: 'white' },
  chanelWraper: {
    flexDirection: 'row',
    marginTop: 8,
    width: '100%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#d8d8d8',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
export default VideoDetail;
