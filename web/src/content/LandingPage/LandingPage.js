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
} from "@carbon/react";
import { LogoGithub } from "@carbon/icons-react";

const LandingPage = () => {
  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <Breadcrumb noTrailingSlash aria-label="Page navigation">
          <BreadcrumbItem>
            <a href="/">Getting started</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="landing-page__heading">
          Visualize CarletonU Course Data Visually
        </h1>
      </Column>

      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Tabs defaultSelectedIndex={0}>
          <TabList className="tabs-group" aria-label="Tab navigation">
            <Tab>About</Tab>
            <Tab>Usage</Tab>
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
                    visualize data about courses offered at CarletonU.
                    CU-Visualizer allows you to see who has taught the course
                    before, how many students took the course, what semester has
                    it been offered and more!
                  </p>
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
                  Rapidly build beautiful and accessible experiences. The Carbon
                  kit contains all resources you need to get started.
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
                  <Link
                    href={"https://github.com/zakuArbor/cu-visualizer"}
                    alt={"Link to Github Repository"}
                    size={"lg"}
                    renderIcon={LogoGithub}
                  >
                    Github
                  </Link>
                  <br />
                  <p>
                    Built using Reactjs with{" "}
                    <a
                      href="https://carbondesignsystem.com/"
                      alt="IBM Carbon Website"
                    >
                      IBM Carbon Design
                    </a>{" "}
                    UX Library
                  </p>
                  <p>
                    Hosted via GithubPages meaning no Database (I'm being
                    cheap).{" "}
                  </p>
                  <p>
                    All data queries comes from pre-generated JSON files using
                    Perl.
                  </p>
                  <p>
                    {" "}
                    All data presented are publically accessible data via{" "}
                    <a
                      href="https://oirp.carleton.ca/main/"
                      alt="Institute Research and Planning Website"
                    >
                      OIRP
                    </a>
                    , CarletonU's Institutional Research and Planning division.
                  </p>
                  <p>
                    Data was scrapped using{" "}
                    <a
                      href="https://www.crummy.com/software/BeautifulSoup/"
                      alt="BeautifulSoup's homepage"
                    >
                      BeautifulSoup
                    </a>
                    , a Python Library for webscrapping.
                  </p>
                  <p>Sorting and filtering is done on the front-end because there's no database involved.</p>
                  <br/>
                  <p><b className="b">Warning:</b> Data may not be accurate as the data scrapper is not written very well</p>
                  <p><b className="b">Warning:</b> Code is ugly. Website and JSON files could be cleaned up to minimize resource consumption. I am just lazy.</p>
                  <br/>
                  <p>Built by a Math student at CarletonU</p>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
};

export default LandingPage;
