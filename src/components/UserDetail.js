import React from 'react';
import { Card } from 'antd';

import './UserDetail.less';

let avatars = [
  // "cassie.png",
  "elyse.png",
  // "eve.png",
  "kristy.png",
  // "lena.png",
  // "lindsay.png",
  // "mark.png",
  "matthew.png",
  "molly.png",
  // "patrick.png",
  // "rachel.png"
];

console.log("avatars:", avatars)


class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    console.log("UserDetail:");
    console.log(props);
  }
  render() {
    console.log("UserDetail:");

    console.log(this.props.match.params.id)
    return(
      <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
        <div className="custom-image">
          <img alt="example" width="100%" src={`/images/${avatars[this.props.match.params.id]}`} />
        </div>
        <div className="custom-card">
          <h3>Europe Street beat</h3>
          <p>www.instagram.com</p>
        </div>
      </Card>
    )
  }
}

export default UserDetail;
