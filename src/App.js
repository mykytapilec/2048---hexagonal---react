import React from 'react';
import Konva from './Konva';
import {config} from './config';
import { Container, Row, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends React.Component {

  constructor(){
    super();
    this.state = {
        isFinish: false,
        hexagonals: config,
    }
}

  isFinish = isFinish => {
    this.setState({
      isFinish
    })
  }

  render(){
    const {hexagonals, isFinish} = this.state
    return (
      <div className="App" >
        <Konva hex={hexagonals} isFinish={this.isFinish}/>
        <Container>
          <Row>
            <Col>{isFinish ? 'Game Status: GAME OVER' : 'Game Status: playing'}</Col>
          </Row> 
          <Row> 
            <Col>Use q, w, e, a, s, d keys for move</Col>
          </Row> 
        </Container>
      </div>
    )
  }
}

export default App;
