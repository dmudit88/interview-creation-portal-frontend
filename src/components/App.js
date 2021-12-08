import "../styles/App.css";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import link from "../link";

function App() {
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleCreateFormSubmit = (e) => {
    e.preventDefault();
    var data = {};
    data["title"] = title;
    data["location"] = location;
    data["description"] = description;
    data["startTime"] = startTime;
    data["endTime"] = endTime;
    console.log(data);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: link + "interview",
    }).then((res) => setUpcomingInterviews(res.data));
    upcomingInterviews.map((i) => console.log(typeof i.participants));
  }, []);
  return (
    <React.Fragment>
      <div className="mb-3">
        <label for="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label for="location" className="form-label">
          Job Location
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label for="description" className="form-label">
          Job Description
        </label>
        <textarea
          className="form-control"
          className="exampleFormControlTextarea1"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label for="startTime">startTime (date and time):</label>
        <input
          type="datetime-local"
          className="form-control"
          id="exampleFormControlInput1"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label for="endTime">endTime (date and time):</label>
        <input
          type="datetime-local"
          className="form-control"
          id="exampleFormControlInput1"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <button
          type="submit"
          onClick={handleCreateFormSubmit}
          className="btn btn-primary"
        >
          Add Interview
        </button>
      </div>
      
      <div>
      <h3>Upcoming Interviews</h3>
          <div>
          <table class="table">
  <thead>
    <tr>
      <th scope="col">Title</th>
      <th scope="col">Location</th>
      <th scope="col">Description</th>
      <th scope="col">Start Time</th>
      <th scope="col">End Time</th>

    </tr>
  </thead>
           
            {upcomingInterviews.map((interviews)=>(
              <tbody scope="row">
                <tr>
                <td>{interviews.title}</td>
                <td>{interviews.location}</td>
                <td>{interviews.description}</td>
                <td>{moment(interviews.startTime).format("DD MMM, YYYY HH:mm")}</td>
                <td>{moment(interviews.endTime).format("DD MMM, YYYY HH:mm")}</td>
                </tr>
              </tbody>
            ))}
             </table>
             </div>
      </div>
    </React.Fragment>
  );
}

export default App;
