import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  Link,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  ToggletipActions,
} from "@carbon/react";
import {
  LogoGithub,
  ChartRelationship,
} from "@carbon/icons-react";

const LandingPage = () => {
  return (
    <>
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <Breadcrumb noTrailingSlash aria-label="Page navigation">
          <BreadcrumbItem>
            <a href="/">Getting started</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="landing-page__heading">
          Chonker University Data Visualization Project
        </h1>
      </Column>

      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Tabs defaultSelectedIndex={0}>
          <TabList className="tabs-group" aria-label="Tab navigation">
            <Tab>About</Tab>
            <Tab className="start">Exp. Features</Tab>
            <Tab>Source</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  md={4}
                  lg={7}
                  sm={4}
                  className="landing-page__tab-content"
                >
                  <h2 className="landing-page__subheading">
                    What is CU-Visualizer?
                  </h2>
                  <p className="landing-page__p">
                    CU-Visualizer is an open-source project designed to
                    visualize data about courses offered at{" "}
                    <Toggletip>
                      <ToggletipButton label="Show information">
                        <span class="b">Chonker University </span>
                      </ToggletipButton>
                      <ToggletipContent>
                        <p>
                          Chonker University is not affliated with CarletonU. It
                          is a fictitious University displaying inaccurate data.
                        </p>
                        <ToggletipActions>
                          <Button size="sm">Learn More</Button>
                        </ToggletipActions>
                      </ToggletipContent>
                    </Toggletip>
                    &nbsp; (NOT CarletonU). CU-Visualizer allows you to see who
                    has taught the course before, how many students took the
                    course, what semester has it been offered and more!
                  </p>
                  <br />

                  <Button className="learn-btn">Learn more</Button>
                </Column>
                <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                  <img
                    className="landing-page__illo"
                    src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                    alt="Carbon illustration"
                  />
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  lg={16}
                  md={8}
                  sm={4}
                  className="landing-page__tab-content"
                >
                  The project is still under development phases but there are a
                  few things that are far from the roadmap that I wanted to work
                  on and things I want to experiment on.
                  <br />
                  <br />
                  <Button
                    className="exp-btn"
                    renderIcon={ChartRelationship}
                    href={"#/test/progression"}
                  >
                    Degree Progrssion
                  </Button>
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  lg={16}
                  md={8}
                  sm={4}
                  className="landing-page__tab-content"
                >
                  <p>
                    <Button
                      className={"repo-btn"}
                      renderIcon={LogoGithub}
                      iconDescription="Github Repository"
                      href={"https://github.com/zakuArbor/cu-visualizer"}
                    >
                      Github
                    </Button>
                  </p>
                  <ul className="tech">
                    <li>
                      Built using Reactjs with{" "}
                      <a
                        href="https://carbondesignsystem.com/"
                        alt="IBM Carbon Website"
                      >
                        IBM Carbon Design
                      </a>{" "}
                      UX Library
                    </li>
                    <li>
                      Hosted via GithubPages meaning no Database (I'm being
                      cheap).{" "}
                    </li>
                    <li>
                      All data queries comes from pre-generated JSON files using
                      Perl.
                    </li>
                    <li>
                      {" "}
                      All data presented are publically accessible data via{" "}
                      <a
                        href="https://oirp.carleton.ca/main/"
                        alt="Institute Research and Planning Website"
                      >
                        OIRP
                      </a>
                      , CarletonU's Institutional Research and Planning
                      division.
                    </li>
                    <li>
                      Data was scrapped using{" "}
                      <a
                        href="https://www.crummy.com/software/BeautifulSoup/"
                        alt="BeautifulSoup's homepage"
                      >
                        BeautifulSoup
                      </a>
                      , a Python Library for webscrapping.
                    </li>
                    <li>
                      Sorting and filtering is done on the front-end because
                      there's no database involved.
                    </li>
                  </ul>
                  <br />
                  <p>
                    <b className="b">Warning:</b> Data is <b className="b">NOT</b> accurate as
                    reliable source of information for the use case of the project could be found. Hence the data is for a fictitious University.
                  </p>
                  <p>
                    <b className="b">Warning:</b> Code is ugly. Website and JSON
                    files could be cleaned up to minimize resource consumption.
                    I am just lazy.
                  </p>
                  <br />
                  <p className="creator-label">
                    Built by a Math student at CarletonU
                  </p>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
    </>
  );
};

export default LandingPage;
