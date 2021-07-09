import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import queryString from "querystring";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import { freeTable } from "../utils/api";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { search } = useLocation();
  const values = queryString.parse(search);
  let date = values["?date"];
  if (!date) {
    date = today();
  }
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState();
  const [reservationsError, setReservationsError] = useState();
  const [thisDate, setThisDate] = useState(date);
  const handleNext = () => {
    setThisDate(next(thisDate));
  };
  const handlePrevious = () => {
    setThisDate(previous(thisDate));
  };
  const handleToday = () => {
    setThisDate(today(thisDate));
  };
  date = thisDate;
  useEffect(loadDashBoard, [thisDate, tables]);
  function loadDashBoard() {
    loadReservations();
    loadTables();
  }
  function loadReservations() {
    const abortControllerRes = new AbortController();
    setReservationsError();
    listReservations({ date }, abortControllerRes.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => {
      abortControllerRes.abort();
    };
  }
  function loadTables() {
    const abortControllerTbl = new AbortController();

    listTables(abortControllerTbl.signal).then(setTables).catch(setTablesError);
    return () => {
      abortControllerTbl.abort();
    };
  }
  function handleFreeTable(table_id) {
    let finish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (finish === true) {
      const abortControllerFre = new AbortController();
      freeTable(table_id, abortControllerFre.signal)
        .then((res) => res)
        .catch(setTablesError);

      return () => {
        abortControllerFre.abort();
      };
    }
  }
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      {ErrorAlert(reservationsError)}
      {reservations.map((reservation) => {
        return (
          <div className="card mt-2 pt-3">
            <div className="card-body">
              <h3 class="d-flex m-3">
                {reservation.first_name} {reservation.last_name}
              </h3>
              <div class="d-flex">
                <p class="d-flex m-3">Time: {reservation.reservation_time}</p>
                <p class="d-flex m-3">People: {reservation.people}</p>
              </div>
              <div class="d-flex">
                <p class="d-flex m-3">Phone #: {reservation.mobile_number}</p>
                <p class="d-flex m-3">Date: {reservation.reservation_date}</p>
              </div>
              <div class="d-flex">
                <p
                  data-reservation-id-status={reservation.reservation_id}
                  class="d-flex m-3"
                >
                  Status: {reservation.status}
                </p>
                <p class="d-flex m-3">
                  Reservation #: {reservation.reservation_id}
                </p>
              </div>
            </div>
            <div class=" p-3 d-flex justify-content-end align-items-center">
              <Link
                to={`/reservations/${reservation.reservation_id}/edit`}
                type="button"
                className="btn btn-secondary mr-2 btn-md"
              >
                Edit
              </Link>
              {reservation.status === "booked" && (
                <Link
                  to={`/reservations/${reservation.reservation_id}/seat`}
                  type="button"
                  className="btn btn-secondary mr-2 btn-md"
                >
                  Seat
                </Link>
              )}
            </div>
          </div>
        );
      })}
      <div class=" p-3 d-flex justify-content-end align-items-center">
        <button
          class="btn btn-large btn-success"
          onClick={() => handlePrevious()}
        >
          Previous
        </button>
        <button
          class="btn btn-large btn-success m-2"
          onClick={() => handleToday()}
        >
          Today
        </button>
        <button class="btn btn-large btn-success" onClick={() => handleNext()}>
          Next
        </button>
      </div>
      <h2 class="d-flex m-3">Tables:</h2>
      {ErrorAlert(tablesError)}
      {tables.map((table) => {
        return (
          <div className="card mt-2 pt-3">
            <div className="card-body">
              <h5 class="d-flex m-3">{table.table_name}</h5>
              <div class="d-flex">
                <p class="d-flex m-3">Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id} class="d-flex m-3">
                  Status: {table.occupied} Reservation:
                  {table.reservation_id}
                </p>
              </div>
            </div>
            <div class=" p-3 d-flex justify-content-end align-items-center">
              {table.occupied === "occupied" && (
                <button
                  data-table-id-finish={table.table_id}
                  type="button"
                  className="btn btn-danger mr-2 btn-md"
                  onClick={() => handleFreeTable(table.table_id)}
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        );
      })}
    </main>
  );
}
export default Dashboard;
