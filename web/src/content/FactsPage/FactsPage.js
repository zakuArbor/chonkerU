import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  InlineNotification,
} from "@carbon/react";
import "@carbon/charts/styles.css";

import { DonutChart, GroupedBarChart } from "@carbon/charts-react";

import { getGenderProgram, getOverallGender, getProgramCount, getProgYear, getGenderYear, getProgGenderYear } from "./ParseFacts";

const FactsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const [source, setSource] = useState({});


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
    }
  };

  const getData = () => {
    fetch("facts/gender.json", {
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
        setData(
          {
            honoursGender: getGenderProgram(res, 'honours'),
            generalGender: getGenderProgram(res, 'general'),
            overallGender: getOverallGender(res),
            program: getProgramCount(res),
            progYear: getProgYear(res),
            genderYear: getGenderYear(res),
            honoursGenderYear: getProgGenderYear(res, 'honours'),
            generalGenderYear: getProgGenderYear(res, 'general'),
          });
        setSource({'source_title': res["source_title"], "source_year": res["source_year"], "source": res["source"]});
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
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          {
            loading ? (
              <>
                <div className="grid-pies">
                  <DonutChart data={[]} options={{ title: "Math Students By Program", "data": { 'loading': loading } }} />
                  <DonutChart data={[]} options={{ title: "Overall Math By Gender", "data": { 'loading': loading } }} />
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
                <div className="grid-pies">
                  <DonutChart data={data['program']} options={options['program']} />
                  <DonutChart data={data['overallGender']} options={options['overallGender']} />
                </div>
                <div className="grid-pies">
                  <DonutChart data={data['honoursGender']} options={options['honoursGender']} />
                  <DonutChart data={data['generalGender']} options={options['generalGender']} />
                </div>
                <GroupedBarChart data={data['progYear']} options={options['progYear']} />
                <GroupedBarChart data={data['genderYear']} options={options['genderYear']} />
                <GroupedBarChart data={data['honoursGenderYear']} options={options['honoursGenderYear']} />
                <GroupedBarChart data={data['generalGenderYear']} options={options['generalGenderYear']} />
                <span><b>Source:</b> <Link to={source['source']}>{source.source_title} - {source.source_year}</Link></span>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default FactsPage;
