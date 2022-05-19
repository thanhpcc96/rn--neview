/**
 * @format
 */
import { UIManager, Text, TextInput } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { Settings } from 'react-native-fbsdk-next';

import { iconsMap, loadIcons } from './src/elements/Icons';
import routes from './src/routes';
import { configStore, store } from './src/store';
import { colors } from './src/theme';
import { isAndroid } from './src/utils/platformHelper';

/** Variable */
let isFirstTime = true;
let storePersit = null;

/** Disable scale font when config UI system */
if (!Text.defaultProps) {
  Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false;

if (!TextInput.defaultProps) {
  TextInput.defaultProps = {};
}
TextInput.defaultProps.allowFontScaling = false;

/** UX for android */
isAndroid && UIManager.setLayoutAnimationEnabledExperimental(true);

/** Initial for FBlogin and Google login */
Settings.initializeSDK();

/** Register route */
const registerComponentWithProvider = (key: string, component) => {
  Navigation.registerComponentWithRedux(key, component, Provider, store);
};
const registerRouters = () => {
  for (const key in routes) {
    registerComponentWithProvider(key, () => routes[key]);
  }
};

// set default style for navigation
function setDefaultStyle() {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
      height: 0,
    },
    statusBar: {
      backgroundColor: 'transparent',
      style: 'dark',
    },
    layout: {
      orientation: ['portrait'],
    },
    bottomTab: {
      textColor: colors.grey,
      iconColor: colors.grey,
      selectedIconColor: colors.blue,
      selectedTextColor: colors.blue,
      // fontFamily: fontFamilys.semiBold,
      fontSize: 14,
      selectTabOnPress: true,
      selectedFontSize: 14,
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
    },
  });
}
export const startLogin = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'login',
            },
          },
        ],
      },
    },
  });
};
export const startTab = () => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'likedVideoTab',
                  },
                },
              ],
              options: {
                statusBar: {
                  style: 'dark',
                  backgroundColor: '#fff',
                },
                bottomTab: {
                  text: 'Liked',
                  icon: iconsMap['thumbs-up-sharp'],
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'commentedTab',
                  },
                },
              ],
              options: {
                statusBar: {
                  style: 'dark',
                  backgroundColor: '#fff',
                },
                bottomTab: {
                  text: 'Commented',
                  icon: iconsMap['ios-chatbox-ellipses-sharp'],
                },
              },
            },
          },
        ],
      },
    },
  });
};

const init = async () => {
  await loadIcons();
  storePersit = await configStore();
};

registerRouters();
Navigation.events().registerAppLaunchedListener(async () => {
  if (isFirstTime || !storePersit) {
    isFirstTime = false;
    await init();
  }

  setDefaultStyle();
  const isLogged = storePersit.getState().auth?.isLogged;
  console.log('aaaa => ', {
    isLogged,
    data: storePersit.getState(),
  });
  if (!isLogged) {
    startLogin();
  } else {
    startTab();
  }
});
