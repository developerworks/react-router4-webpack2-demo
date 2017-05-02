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

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
        <div className="custom-card">
          <h3>头像</h3>
          <p>单击下载该图片</p>
        </div>
        <div className="custom-image">
          <a href={`/images/${avatars[this.props.match.params.id]}`} download={`${avatars[this.props.match.params.id]}`} type="image/png">
            <img alt="example" width="100%" src={`/images/${avatars[this.props.match.params.id]}`} />
          </a>
        </div>

      </Card>
    )
  }
}

export default UserDetail;
