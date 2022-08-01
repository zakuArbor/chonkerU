import React, { Component } from 'react';
import './app.scss';
import { Content } from '@carbon/react';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './content/LandingPage';
import CoursesPage from './content/CoursesPage';
import CoursePage from './content/CoursePage';
import ProfPage from './content/ProfPage';
import ProfsPage from './content/ProfsPage';


/*
Sorts courses by epoch time, not the most accurate but assuming source data is released on timely manner
*/
let semester_sort = (x, y) => {
  if (x.epoch < y.epoch) {
    return -1;
  }
  if (x.epoch > y.epoch) {
    return 1;
  }
  return 0;
};

class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Content>
          <Routes>
            <Route exact path={"/"} element={<LandingPage/>} />
            <Route path={"/courses"} element={<CoursesPage/>} />
            <Route path={"/course/:code"} element={<CoursePage/>} />
            <Route path={"/profs"} element={<ProfsPage/>} />
            <Route path={"/prof/:prof"} element={<ProfPage/>} />
          </Routes>
        </Content>
      </>
    );
  }
}
export default App;