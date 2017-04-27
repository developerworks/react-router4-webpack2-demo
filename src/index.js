//@flow

import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import { renderRoutes } from 'react-router-config';

import App from './App';

// import { AppContainer } from 'react-hot-loader';
// const render = Component => {
//   ReactDOM.render(
//     <AppContainer>
//       <Component />
//     </AppContainer>,
//     document.getElementById('App')
//   );
// }
// render(App);
// if (module.hot) {
//   module.hot.accept('./App', () => { render(App) });
// }

ReactDOM.render(
  <App />,
  document.getElementById('App')
);

