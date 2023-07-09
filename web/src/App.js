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
import ProgressionPage from './content/exp/ProgressionPage';
import ProgramsPage from "./content/ProgramsPage";
import ProgPage from './content/ProgPage/ProgPage';
import FactsPage from './content/FactsPage/FactsPage';
import {ActionableNotification} from '@carbon/react';


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
        <div><ActionableNotification
          title="Warning"
          subtitle="Data Presented are not accurate as data presented by OIRP collects data in a weird way to fit their own use case. This is for a fictitious University. Chonker University happens to have huge resemblance to CarletonU."
          hideCloseButton
          inline={true}
          className={"warning"}
          actionButtonLabel="Learn More"
          onActionButtonClick={()=> console.log("action clicked")}
        /></div>
        <Content>
          <Routes>
            <Route exact path={"/"} element={<LandingPage/>} />
            <Route path={"/courses"} element={<CoursesPage/>} />
            <Route path={"/course/:code"} element={<CoursePage/>} />
            <Route path={"/profs"} element={<ProfsPage/>} />
            <Route path={"/prof/:prof"} element={<ProfPage/>} />
            <Route path={"/test/progression"} element={<ProgressionPage/>}/>
            <Route path={"/programs"} element={<ProgramsPage/>} />
            <Route path={"/program/:prog"} element={<ProgPage/>}/>
            <Route path={"/facts"} element={<FactsPage/>}/>
          </Routes>
        </Content>
      </>
    );
  }
}
export default App;