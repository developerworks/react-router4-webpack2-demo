import style from './App.less';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';

import { Menu, Icon, Dropdown} from 'antd';

// 模块异步加载器
import Bundle         from './bundle.js';
import Nav            from './components/Nav';
import PreloadSpinner from './components/PreloadSpinner';
import About          from './components/About';
import Home           from './components/Home';
import UserPage       from './components/UserPage';
import UserDetail     from './components/UserDetail';
import NotFound       from './components/NotFound';

import SubHome        from './components/SubHome';

const submenu = (
  <Menu>
    <Menu.Item key="0">
      <Link to="/settings"><Icon type="mail"/>&nbsp;&nbsp;<span className="nav-text">设置</span></Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to="/settings"><Icon type="mail"/>&nbsp;&nbsp;<span className="nav-text">我的收藏夹</span></Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <Link to="/settings"><Icon type="mail"/>&nbsp;&nbsp;<span className="nav-text">退出系统</span></Link>
    </Menu.Item>
  </Menu>
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
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="mail" />
                <span className="nav-text">主页</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/about">
              <Link to="/about">
                <Icon type="clock-circle-o" />
                <span className="nav-text">计划</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/users">
              <Link to="/users">
                <Icon type="user" />
                <span className="nav-text">用户</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/404">
              <Link to="/404">
                <Icon type="mail"/>
                <span className="nav-text">NotFound</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/subhome">
              <Link to="/subhome">
                <Icon type="mail"/>
                <span className="nav-text">SubHome</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="/profile">
              <Dropdown overlay={submenu} trigger={['click']}>
                <a className="ant-dropdown-link">
                  <span className="nav-text">Profile</span>
                  &nbsp;&nbsp;
                  <Icon type="down-circle-o" />
                </a>
              </Dropdown>
            </Menu.Item>

          </Menu>

          <div style={{marginTop: 10}}></div>

          <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/subhome" component={SubHome}/>

          <Route path="/about" component={About}/>
          <Route path="/users" component={UserPage} />
          <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    )
  }
}
export default App;
