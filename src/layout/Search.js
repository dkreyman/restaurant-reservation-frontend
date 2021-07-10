import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "querystring";
import { listReservations } from "../utils/api";
import { today } from "../utils/date-time";
import ErrorAlert from "./ErrorAlert";
import ReservationsList from "./ReservationsList";

function Search() {
  const initialFormState = {
    mobile_number: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState();

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  const history = useHistory();
  const handleSubmit = (event) => {
    const abortControllerRes = new AbortController();
    listReservations(
      { mobile_number: formData["mobile_number"] },
      abortControllerRes.signal
    )
      .then((res) => {
        setReservations(res);

        setReservationsError();
      })
      .catch((err) => {
        setReservationsError(err);
        setReservations([]);
      });

    return () => {
      abortControllerRes.abort();
    };
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
              Search
            </li>
          </ol>
        </nav>
        <h1>Search Reservation</h1>
      </div>
      {ErrorAlert(reservationsError)}
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="capacity">
              Capacity:
              <input
                className="form-control d-inline"
                id="capacity"
                type="text"
                name="mobile_number"
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
                value={formData.mobile_number}
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
          <button
            className="btn btn-primary btn-md"
            type="button"
            onClick={handleSubmit}
          >
            Find
          </button>
        </form>
      </div>
      <ReservationsList reservations={reservations} />
    </>
  );
}
export default Search;
