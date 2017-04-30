import React from 'react';
import { Table, Icon } from 'antd';

import {
  Link
} from 'react-router-dom';
import UserDetail from './UserDetail';


const avatars = [
  // "cassie.png",
  "elyse.png",
  // "eve.png",
  "kristy.png",
  // "lena.png",
  // "lindsay.png",
  // "mark.png",
  "matthew.png",
  // "molly.png",
  // "patrick.png",
  // "rachel.png"
];

const data = [];

for(let i = 0; i <= avatars.length; i++){
  data.push({key: i, name: '胡彦祖',age: 42,address: '西湖区湖底公园1号', image: `${i}/${avatars[i]}`});
}

const columns = [
  { title: 'ID',dataIndex: 'key',key: 'key'},
  { title: '姓名',dataIndex: 'name',key: 'name', render: function(text, record, index) {
    return (<Link to={`/users/${index}`}><div style={{display: 'block'}}>{text}</div></Link>)
  }},
  { title: '年龄',dataIndex: 'age',key: 'age'},
  { title: '住址',dataIndex: 'address',key: 'address'},
  {
    title: 'Action',
    key: 'action',
    render: function(text, record, index){
      return (
        <span>
          <a><Icon type="plus" /></a>
          <span className="ant-divider" />
          <a><Icon type="close" /></a>
        </span>
      )
    }
  }
];

class UserList extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div>
        <Table columns={columns} dataSource={data} size="middle" />
      </div>
    )
  }
}

export default UserList;
