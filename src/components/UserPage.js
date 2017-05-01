import React      from 'react';
import UserList   from './UserList';
import UserDetail from './UserDetail';8
import { Route } from 'react-router-dom';

import { Row, Col } from 'antd';

class UserPage extends React.Component {
  constructor(props){
    super(props)
    console.log("UserPage:")
    console.log(props)
  }
  render(){
    return (
      <div>
        <h2 className="pagetitle">用户信息页</h2>
        <Row gutter={16}>
          <Col span={16}>
            <UserList />
          </Col>
          <Col span={4}>
            <Route path={`${this.props.match.url}/:id`} component={UserDetail}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default UserPage;
