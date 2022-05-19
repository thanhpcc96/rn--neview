import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import { auth } from './auth';

const config = {
  key: 'Thanhpcc',
  storage: AsyncStorage,
  whitelist: ['auth'],
  debug: true,
};

export default persistReducer(config, combineReducers({ auth }));
