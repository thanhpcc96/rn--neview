// import React from 'react';
import { PixelRatio, Platform } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import type { ImageSource } from 'react-native-vector-icons/Icon';

const iconsSize: number =
  !__DEV__ && Platform.OS === 'android'
    ? PixelRatio.getPixelSizeForLayoutSize(24)
    : 24;

const icons: { [key: string]: number } = {
  'chatbubble-sharp': iconsSize,
  'people-sharp': iconsSize,
  'thumbs-up-sharp': iconsSize,
  'ios-chatbox-ellipses-sharp': iconsSize,
};

const iconsMap: { [key: string]: any } = {};
const loadIcons = () =>
  new Promise(resolve =>
    Promise.all(
      Object.keys(icons).map(iconName =>
        IonIcons.getImageSource(iconName, icons[iconName]),
      ),
    ).then((sources: Array<ImageSource>) => {
      Object.keys(icons).forEach(
        (iconName, idx) => (iconsMap[iconName] = sources[idx]),
      );
      resolve(true);
    }),
  );
export { iconsMap, loadIcons };
// export const  IconsCustom: React.FC<any> = props => {
//  return()
// }
