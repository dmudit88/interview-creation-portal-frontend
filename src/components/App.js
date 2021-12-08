import "../styles/App.css";
import axios from "axios";
import moment, { localeData } from "moment";
import React, { useEffect, useState } from "react";
import link from "../link";

function App() {
  const [isOn, setIsOn] = useState(false);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participants, setPartcipants] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("");
  const [hideAddbtn, setAddbtn] = useState("");
  const [hideEditbtn, setEditbtn] = useState("invisible");
  const [oldData, setOldData] = useState([]);

  const displayParticipant = (data) => {
    var s = "";
    for (var i = 0; i < data.length; i++) {
      s += data[i].email;
      if (i !== data.length - 1) {
        s += ",";
      }
    }
    return s;
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEdit = (e, data) => {
    e.preventDefault();
    console.log(data);
    setTitle(data.title);
    setLocation(data.location);
    setDescription(data.description);
    // console.log(moment(data.startTime).format("dd/mm/yyyy,hh:mm"));
    setStartTime("");
    setEndTime("");
    setPartcipants(displayParticipant(data.participants));

    setOldData(data._id);
    setAddbtn("invisible");
    setEditbtn("");
  };
  const handleCancel = (e) => {
    e.preventDefault();

    setOldData("");
    setAddbtn("");
    setEditbtn("invisible");
  };

  const handleFormSubmit = (e, mode) => {
    e.preventDefault();

    if (!title || !location || !description || !startTime || !endTime) {
      setAlertClassName("alert alert-danger");
      setAlertMessage("Error: Please fill all the fields");
      return;
    }
    const currdate = new Date(Date.now()).toISOString();
    console.log(currdate);
    console.log(startTime);
    const startt = new Date(startTime).toISOString();
    if (startt < currdate) {
      setAlertClassName("alert alert-danger");
      setAlertMessage("Error: StartTime Invalid");
      return;
    }
    if (startTime > endTime) {
      setAlertClassName("alert alert-danger");
      setAlertMessage("Error: StartTime should be before EndTime");
      return;
    }
    var arr = participants.split(",");
    if (arr.length < 2) {
      setAlertClassName("alert alert-danger");
      setAlertMessage("Error: No. of Participants less than 2");
      return;
    }
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
      // if(!validateEmail(arr[i])){
      //   alert("Error: Participant's email invalid")
      //   return;
      // }
    }
    var data = {};
      data["title"] = title;
      data["location"] = location;
      data["description"] = description;
      data["startTime"] = startTime;
      data["endTime"] = endTime;

      data["participants"] = arr;
    if (mode === "add") {
      
      console.log(arr);
      console.log(data);
      axios.post(link + "/interview", data).then((res) => {
        console.log(res);
        if (res.status == 201) {
          setAlertClassName("alert alert-success");
        } else {
          setAlertClassName("alert alert-danger");
        }
        setAlertMessage(res.data);
      });
    }else{
      data["interviewId"]=oldData;
      axios.put(link + "/interview", data).then((res) => {
        if (res.status == 201) {
          setAlertClassName("alert alert-success");
        } else {
          setAlertClassName("alert alert-danger");
        }
        setAlertMessage(res.data);
      });
    }
    setIsOn(isOn ^ 1);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: link + "/interview",
    }).then((res) => setUpcomingInterviews(res.data));
    upcomingInterviews.map((i) => console.log(i));
  }, [isOn]);
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
        <label for="participants" className="form-label">
          Participants:
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          value={participants}
          onChange={(e) => setPartcipants(e.target.value)}
          placeholder="Enter email of participants separated by commas"
        />
      </div>
      <div className="mb-3">
        <button
          type="submit"
          onClick={(e) => {
            handleFormSubmit(e, "add");
          }}
          className={"btn btn-primary " + hideAddbtn}
        >
          Add Interview
        </button>
        <button
          type="submit"
          onClick={(e) => {
            handleFormSubmit(e, "edit");
          }}
          className={"btn btn-primary " + hideEditbtn}
        >
          Edit Interview
        </button>
        <button
          type="submit"
          onClick={handleCancel}
          className={"btn btn-primary " + hideEditbtn}
        >
          Cancel
        </button>
        <div className={alertClassName} role="alert">
          {alertMessage}
        </div>
      </div>

      <div>
        <h3>Upcoming Interview Schedule</h3>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Location</th>
                <th scope="col">Description</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Participants</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>

            {upcomingInterviews.map((interviews) => (
              <tbody scope="row">
                <tr>
                  <td>{interviews.title}</td>
                  <td>{interviews.location}</td>
                  <td>{interviews.description}</td>
                  <td>
                    {moment(interviews.startTime).format("DD MMM, YYYY HH:mm")}
                  </td>
                  <td>
                    {moment(interviews.endTime).format("DD MMM, YYYY HH:mm")}
                  </td>
                  <td>{displayParticipant(interviews.participants)}</td>
                  <td>
                    <button
                      type="submit"
                      onClick={(e) => handleEdit(e, interviews)}
                      className={"btn btn-primary "}
                    >
                      Edit
                    </button>
                  </td>
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
