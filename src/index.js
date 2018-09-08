import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

import './index.css';

const store = createStore(
  rootReducer,
  {
    photoData: [],
    page: 0,
    articlesPerPage: 3,
    activeIndex: 0,
    openIndex: null,
    pausedOn: null,
    browsing: false,
    scrollY: 0,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
