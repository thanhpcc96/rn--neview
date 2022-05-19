import { createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';

import reducers from './reducers';

const enhancer = [];
//@ts-ignore
window.devToolsExtension && enhancer.push(window.devToolsExtension());

const initState = {};
export const store = createStore(reducers, initState, compose(...enhancer));

export const configStore = () => {
  return new Promise(resolve => {
    persistStore(store, null, () => resolve(store));
  });
};
