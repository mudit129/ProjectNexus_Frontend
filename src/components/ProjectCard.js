import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img from "../images/aerospace.jpg";
import ProjectImage from "./ProjectImage/ProjectImage";
const config = require("../config_frontend.js");

const host = config.server.host;

const ProjectCard = (props) => {
  const navigate = useNavigate();
  const { project, updateProject, deleteProject, page, md } = props;
  const [type, setType] = useState("");
  let [flag, setFlag] = useState(true);
  const getType = async () => {
    const url = `${host}/api/auth/getuser`;
    const result = await axios.get(url, {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    setType(result.data.type);
    console.log(result.data);
    console.log(result.data.name);
    console.log(result.data.type);
  };

  const handleApprove = async () => {
    const url = `${host}/api/projects/approveProject/${project._id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        // 'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    console.log("Project approved");
    props.showAlert("Project approved succesfully", "success");
  };

  useEffect(() => {
    if (page !== "all") 
      getType();
  }, [page]);

  const trimDesc = (desc, len) => {
    if (desc.length > len) desc = desc.slice(0, len) + "....";
    return desc;
  };
  console.log(project._id);
  console.log(project.image);
  
  const checkImageExists = async (filename) => {
    try {
        const response = await fetch(`${host}/check-image/${filename}`);
        if (response.ok) {
            // Image exists, display it
            return true;
        } else {
            // Image does not exist, display default page
            return false;
        }
    } catch (error) {
        console.error('Error checking image existence:', error);
        // Handle error
        return false;
    }
};
  const imgurl = `${host}/files/${project.image}`
  console.log(imgurl);

  useEffect(() => {
    checkImageExists(project.image)
        .then((exists) => {
            if (exists) {
                // Image exists, proceed to display it
                setFlag(true);
            } else {
                // Image does not exist, display default page
                setFlag(false);
            }
        });
}, [project.image]);

  return (
    <div className={`col-md-${md}`}>
      <div className="card my-3 mx-2" style={{ borderColor: "#1A374D" }}>
        {/* {!project.image ? ( */}
        {!flag ? (
          <ProjectImage
            projectimage={img}
            className="card-img-top"
            alt="project"
          />
        ) : (
          <ProjectImage
            projectimage={`${host}/files/${project.image}`}
            className="card-img-top"
            alt="project"
          />
        )}

        <div className="card-body">
          <div className="d-flex bd-highlight">
            <h5 className="p flex-grow-1 bd-highlight card-title">
            {trimDesc(project.title, 30)}
            </h5>
            {page !== "all" ? (
              <i
                className="p-2 bd-highlight far fa-trash-alt"
                onClick={() => {
                  deleteProject(project._id);
                }}
              ></i>
            ) : (
              <></>
            )}

            {page !== "all" && type === "student" ? (
              <i
                className="p-2 bd-highlight far fa-edit"
                onClick={() => {
                  updateProject(project);
                }}
              ></i>
            ) : (
              <></>
            )}
          </div>
          <p className="card-text">{trimDesc(project.desc, 50)}</p>

          <br></br>
          <br></br>
          <div className="d-flex">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/projectdetails/${project._id}`)}
            >
              Read More
            </button>
            {type === "prof" && page === "pending" ? (
              <button className="btn btn-success" onClick={handleApprove}>
                Approve
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
