import React from 'react';
import { Menu, Icon } from 'antd';
import UserList from './UserList';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home'
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    // console.log('click', e)
    this.setState({
      current: e.key
    });
  }
  render() {
    return (
      <div>
        <h2>主页</h2>
        <br/>
      </div>
    )
  }
}
export default Home;
