import React from 'react';
// import { renderRoutes } from 'react-router-config';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

// 模块异步加载器
import Bundle from './bundle.js';
import Nav   from './components/Nav';

import loadAbout from 'bundle-loader?lazy!./components/About';
import loadHome  from 'bundle-loader?lazy!./components/Home';
import loadUsers from 'bundle-loader?lazy!./components/Users';


const Loading = () => (
  <div>努力加载中...</div>
)
const About = ({...props}) => (
  <Bundle load={loadAbout}>
    {(Component) => Component? <Component {...props}/>: <Loading />}
  </Bundle>
)
const Home = ({...props}) => (
  <Bundle load={loadHome}>
    {(Component) => Component? <Component {...props}/>: <Loading />}
  </Bundle>
)
const Users = ({...props}) => (
  <Bundle load={loadUsers}>
    {(Component) => Component? <Component {...props}/>: <Loading />}
  </Bundle>
)
const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
      <hr/>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/users" component={Users}/>
    </div>
  </Router>
)
// const routes = [{
//   component: Nav,
//   routes: [{
//     path: '/',
//     exact: true,
//     component: Home,
//   }, {
//     path: '/about',
//     component: About,
//   }, {
//     path: '/users',
//     component: Users
//   }]
// }];
// export default routes;

export default App;
