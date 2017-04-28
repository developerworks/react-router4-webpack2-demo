import React from 'react';
import { DatePicker } from 'antd';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange(date, dateString) {
    console.log(date, dateString);
  }
  render() {
    return (
      <div>
        <DatePicker onChange={this.onChange} />
      </div>
    )
  }
}

export default About;


