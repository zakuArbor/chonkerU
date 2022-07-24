import React, { Component } from 'react';
import './app.scss';
import { Content } from '@carbon/react';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './content/LandingPage';
import CoursesPage from './content/CoursesPage';

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Content>
          <Routes>
            <Route exact path="/" element={<LandingPage/>} />
            <Route path="/courses" element={<CoursesPage/>} />
          </Routes>
        </Content>
      </>
    );
  }
}
export default App;