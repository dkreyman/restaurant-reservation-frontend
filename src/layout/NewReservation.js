import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ErrorAlert from "./ErrorAlert";
function NewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [formError, setFormError] = useState();
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
    if (target.name === "people") {
      setFormData({
        ...formData,
        [target.name]: parseInt(target.value),
      });
    }
  };
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    formData.reservation_date = formatAsDate(formData.reservation_date);

    createReservation({ data: formData })
      .then((res) => {
        history.push(`/dashboard/?date=${formData.reservation_date}`);
        setFormData({ ...initialFormState });
        setFormError();
      })
      .catch(setFormError);
  };
  const goToPreviousPath = () => {
    setFormData({ ...initialFormState });
    history.goBack();
  };

  return (
    <>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              New Reservation
            </li>
          </ol>
        </nav>
        <h1>New Reservation</h1>
      </div>
      {ErrorAlert(formError)}
      {/* {ErrorDisplay(formError2)} */}
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">
              First Name:
              <input
                className="form-control d-inline"
                id="first_name"
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                value={formData.first_name}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="last_name">
              Last Name:
              <input
                className="form-control d-inline"
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                value={formData.last_name}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number">
              Phone Number:
              <input
                className="form-control d-inline"
                id="mobile_number"
                type="tel"
                name="mobile_number"
                placeholder="123-456-7899"
                // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required
                onChange={handleChange}
                value={formData.mobile_number}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="reservation_date">
              Reservation Date:
              <input
                className="form-control d-inline"
                id="reservation_date"
                type="date"
                name="reservation_date"
                placeholder="Reservation Date"
                // min={today()}
                onChange={handleChange}
                value={formData.reservation_date}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="reservation_time">
              Reservation Time:
              <input
                className="form-control d-inline"
                id="reservation_time"
                type="time"
                name="reservation_time"
                placeholder="Reservation Time"
                onChange={handleChange}
                value={formData.reservation_time}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="people">
              # 0f People:
              <input
                className="form-control d-inline"
                id="people"
                type="number"
                name="people"
                min="1"
                placeholder="#"
                onChange={handleChange}
                value={formData.people}
              />
            </label>
          </div>
          <br />
          <button
            type="button"
            className="btn btn-secondary btn-md mr-2"
            onClick={goToPreviousPath}
          >
            Cancel
          </button>
          <button className="btn btn-primary btn-md" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
export default NewReservation;
