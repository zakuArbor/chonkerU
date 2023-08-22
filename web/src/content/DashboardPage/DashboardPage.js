import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  InlineNotification,
} from "@carbon/react";
import "@carbon/charts/styles.css";
import {Helmet} from "react-helmet";

import { DonutChart, GroupedBarChart, StackedBarChart } from "@carbon/charts-react";

import { 
  getGenderProgram, 
  getOverallGender, 
  getProgramCount, 
  getProgYear, 
  getGenderYear, 
  getProgGenderYear, 
  getProgs,
  getResidency,
  getOverallResidency,
} from "./ParseFacts";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const [genderSource, setGenderSource] = useState({});
  const [progSource, setProgSource] = useState({});
  const [residencySource, setResidencySource] = useState({});

  const pie_option_template = {
    "resizable": true,
    "data": {
      "loading": false
    },
    "donut": {
      "center": {
        "label": "Math Students"
      }
    },
    "height": "400px",
    "width": "400px",
    "theme": "white"
  };

  const bar_option_template = {
    "axes": {
      "left": {
        "mapsTo": "value",
        "title": "# of Students"
      },
      "bottom": {
        "scaleType": "labels",
        "mapsTo": "key",
        "title": "Academic Year Standing"
      }
    },
    "height": "400px"
  };

  const options = {
    'honoursGender': {
      ...pie_option_template,
      "title": "Honors Math By Gender",
      "donut": {
        "center": {
          "label": "Honors Math Students"
        }
      },
    },
    'generalGender': {
      ...pie_option_template,
      "title": "General Math By Gender",
      "donut": {
        "center": {
          "label": "General Math Students"
        }
      },
    },
    'overallGender': {
      ...pie_option_template,
      "title": "Overall Math By Gender"
    },
    'program': {
      ...pie_option_template,
      "title": "Students By Program"
    },
    'progYear': {
      ...bar_option_template,
      "title": "Math Program By Year Standing"
    },
    'genderYear': {
      ...bar_option_template,
      "title": "Genders in Math By Year Standing"
    },
    'honoursGenderYear': {
      ...bar_option_template,
      "title": "Genders in Math Honours By Year Standing"
    },
    'generalGenderYear': {
      ...bar_option_template,
      "title": "Genders in Math General By Year Standing"
    },
    'progs': {
      ...bar_option_template,
      "title": "Breakdown of Programs in Mathematics"
    },
    'honoursResidency': {
      ...pie_option_template,
      "title": "Residency in Honors Math"
    },
    'generalResidency': {
      ...pie_option_template,
      "title": "Residency in General Math"
    },
    'overallResidency': {
      ...pie_option_template,
      "title": "Residency in Math"
    }
  };

  const getData = () => {
    fetch("dashboard/data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((res) => {
        setLoading(false);
        let gender = res['gender'];
        let prog = res['prog'];
        let residency = res['residency'];
        setData(
          {
            honoursGender: getGenderProgram(gender, 'honours'),
            generalGender: getGenderProgram(gender, 'general'),
            overallGender: getOverallGender(gender),
            program: getProgramCount(gender),
            progYear: getProgYear(gender),
            genderYear: getGenderYear(gender),
            honoursGenderYear: getProgGenderYear(gender, 'honours'),
            generalGenderYear: getProgGenderYear(gender, 'general'),
            progs: getProgs(prog['progs']),
            honoursResidency: getResidency(residency, 'honours'),
            generalResidency: getResidency(residency, 'general'),
            overallResidency: getOverallResidency(residency),
          });
        setGenderSource({'source_title': gender["source_title"], "source_year": gender["source_year"], "source": gender["source"]});
        setResidencySource({'source_title': residency["source_title"], "source_year": residency["source_year"], "source": residency["source"]});
        setProgSource({'source_title': prog["source_title"], "source_year": prog["source_year"], "source": prog["source"]});
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };
  useEffect(() => {
    console.log("ProgramsPage useEffect fired");
    getData();
  }, []);

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter chart-page">
      {/*<Helmet>
        <script src="http://d3js.org/d3.v4.js"></script>
      </Helmet>*/}
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          {
            loading ? (
              <>
                <div className="grid-pies">
                  <DonutChart data={[]} options={{ title: "Math Students By Program", "data": { 'loading': loading } }} />
                  <DonutChart data={[]} options={{ title: "Overall Math By Gender", "data": { 'loading': loading } }} />
                  <DonutChart data={[]} options={{ title: "Overall Math By Residency", "data": { 'loading': loading } }} />
                </div>
                <div className="grid-pies">
                  <DonutChart data={[]} options={{ title: "Honors Math By Gender", "data": { 'loading': loading } }} />
                  <DonutChart data={[]} options={{ title: "General Math By Gender", "data": { 'loading': loading } }} />
                </div>
              </>
            ) : error ? (
              <>
                <InlineNotification
                  title="Error"
                  subtitle="Failed to retrieve Data"
                  hideCloseButton={true}
                />
              </>
            ) : (
              <>
                <h1 className="dashboard-title">ChonkerU Math Dashboard</h1>
                {/*<svg id='picto-pop'></svg>*/}
                <div className="grid-pies">
                  <DonutChart data={data['program']} options={options['program']} />
                  <DonutChart data={data['overallGender']} options={options['overallGender']} />
                  <DonutChart data={data['overallResidency']} options={options['overallResidency']} />
                </div>
                <div className="grid-pies">
                  <DonutChart data={data['honoursGender']} options={options['honoursGender']} />
                  <DonutChart data={data['generalGender']} options={options['generalGender']} />
                </div>
                <div className="grid-pies">
                  <DonutChart data={data['honoursResidency']} options={options['honoursResidency']} />
                  <DonutChart data={data['generalResidency']} options={options['generalResidency']} />
                </div>
                <GroupedBarChart data={data['progYear']} options={options['progYear']} />
                <GroupedBarChart data={data['genderYear']} options={options['genderYear']} />
                <GroupedBarChart data={data['honoursGenderYear']} options={options['honoursGenderYear']} />
                <GroupedBarChart data={data['generalGenderYear']} options={options['generalGenderYear']} />
                <br/>
                <p><b>Source:</b> <Link to={genderSource['source']}>{genderSource.source_title} - {genderSource.source_year}</Link></p>
                <p><b>Source:</b> <Link to={residencySource['source']}>{residencySource.source_title} - {residencySource.source_year}</Link></p>

                <StackedBarChart data={data['progs']} options={options['progs']} />
                <br/>
                <p><b>Source:</b> <Link to={progSource['source']}>{progSource.source_title} - {progSource.source_year}</Link></p>
              
                </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
