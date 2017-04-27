import React from 'react';

const About = () => <div>About</div>;

export default About;


class Test extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: "hezhiqiang",
      email: "developerworks@163.com"
    }
  }

  render() {
    return (
      <div>name: {name}</div>
    )
  }
}

class Roles extneds React.Component {
  constructor() {

  }
  render(){
    return (
      <div className={{fontSize: 10px}}></div>
    )
  }
}
