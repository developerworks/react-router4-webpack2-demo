import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// 禁止拖拽
class Link extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <RouterLink to={this.props.to} draggable="false">{this.props.children}</RouterLink>
    )
  }
}
export default Link;
