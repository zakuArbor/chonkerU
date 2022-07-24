import { React, Fragment, useState } from 'react';

const CoursePage= ({data: {c_proj, web_proj}}) => {
    const [display, setDisplay] = useState("c_proj");
    const projects = {"c_proj": c_proj, "web_proj": web_proj};
   
    const handleClick = (id) => {
        setDisplay(id);
    };  

    return (
        <Fragment>
            <ProjectContextSwitcher handler = {handleClick}/>
            <div className = "page-content">
            {
                (projects[display] !== undefined) ?
                    <div className="content">
                    {
                        projects[display].map(function (obj, i) {
                        var key = "proj" + i; //this is to avoid hild unique key prop warning
                        var hr = () => { return (<hr/>)};   
                        return <div key = {key}>
                            <ProjectItem data = {obj} />
                            {hr()}
                            </div>
                        })
                    }
                    <div id = "project_footer"><a href = "https://github.com/zakuArbor">Any many more on my github page</a></div>     
                    </div> : <Fragment></Fragment>
            }
            </div>
        </Fragment>
  );
}

export default CoursePage;
