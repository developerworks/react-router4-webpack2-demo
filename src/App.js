import './App.less';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {
  Menu, Icon
} from 'antd';
// 模块异步加载器
import Bundle from './bundle.js';
import Nav   from './components/Nav';
import PreloadSpinner   from './components/PreloadSpinner';
import loadAbout from 'bundle-loader?lazy!./components/About';
import loadHome  from 'bundle-loader?lazy!./components/Home';
import loadUsers from 'bundle-loader?lazy!./components/Users';

const About = ({...props}) => (
  <Bundle load={loadAbout}>
    {(Component) => Component? <Component {...props}/>: <PreloadSpinner />}
  </Bundle>
)
const Home = ({...props}) => (
  <Bundle load={loadHome}>
    {(Component) => Component? <Component {...props}/>: <PreloadSpinner />}
  </Bundle>
)
const Users = ({...props}) => (
  <Bundle load={loadUsers}>
    {(Component) => Component? <Component {...props}/>: <PreloadSpinner />}
  </Bundle>
)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home'
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('click', e)
    this.setState({
      current: e.key
    });
  }
  render() {
    return (
      <Router>
        <div>
          <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            <Menu.Item key="home">
              <Link to="/">
                <Icon type="mail" />
                <span className="nav-text">主页</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/about">
              <Link to="/about">
                <Icon type="mail"/>
                <span className="nav-text">关于</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/users">
              <Link to="/users">
                <Icon type="mail"/>
                <span className="nav-text">用户</span>
              </Link>
            </Menu.Item>
          </Menu>
          <div style={{marginTop: 10}}></div>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/users" component={Users}/>
        </div>
      </Router>
    )
  }
}
export default App;
