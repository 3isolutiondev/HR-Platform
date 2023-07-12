/** import Redux, Redux thunk, Redux Persist and Reducer */
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/rootReducer';

/**
 * Redux persist configuration
 * @ignore
 */

 const migrations = {
    0: rootReducer
  };

const MIGRATION_DEBUG = false;

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  migrate: createMigrate(migrations, { debug: MIGRATION_DEBUG }),
  whitelist: [
    'auth',
    'torForm',
    'torFilter',
    'torRecommendations',
    'filter',
    'jobRecommendationFilter',
    'allProfilesFilter',
    'jobFilter',
    'myTeam'
  ]
}

/**
 * persist the reducer based on persistConfig
 * @ignore
 */
const persistedReducer = persistReducer(persistConfig, rootReducer)

/**
 * create store
 * @ignore
 */
const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

/**
 * persist the store
 * @ignore
 */
let persistor = persistStore(store)

export { persistor, store };
