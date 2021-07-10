import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "querystring";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import { freeTable } from "../utils/api";
import { updateResStatus } from "../utils/api";
import ReservationsList from "../layout/ReservationsList";

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
  useEffect(() => {
    const loadTables = () => {
      const abortControllerTbl = new AbortController();

      listTables(abortControllerTbl.signal)
        .then(setTables)
        .catch(setTablesError);
      return () => {
        abortControllerTbl.abort();
      };
    };

    loadTables();
  }, [tables, reservations]);
  useEffect(() => {
    const loadReservations = () => {
      const abortControllerRes = new AbortController();
      listReservations({ date }, abortControllerRes.signal)
        .then(setReservations)
        .catch(setReservationsError);
      return () => {
        abortControllerRes.abort();
      };
    };

    loadReservations();
  }, [date]);

  function handleFreeTable(table) {
    let finish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (finish === true) {
      const abortControllerFre = new AbortController();
      const abortControllerStat = new AbortController();
      freeTable(table.table_id, abortControllerFre.signal)
        .then((res) => res)
        .catch(setTablesError);
      updateResStatus(
        table.reservation_id,
        "finished",
        abortControllerStat.signal
      )
        .then((res) => res)
        .catch(setReservationsError);
      return () => {
        abortControllerFre.abort();
        abortControllerStat.abort();
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
      <ReservationsList reservations={reservations} />
      <div className=" p-3 d-flex justify-content-end align-items-center">
        <button
          className="btn btn-large btn-success"
          onClick={() => handlePrevious()}
        >
          Previous
        </button>
        <button
          className="btn btn-large btn-success m-2"
          onClick={() => handleToday()}
        >
          Today
        </button>
        <button
          className="btn btn-large btn-success"
          onClick={() => handleNext()}
        >
          Next
        </button>
      </div>
      <h2 className="d-flex m-3">Tables:</h2>
      {ErrorAlert(tablesError)}
      {tables.map((table) => {
        return (
          <div key={table.table_id} className="card mt-2 pt-3">
            <div className="card-body">
              <h5 className="d-flex m-3">{table.table_name}</h5>
              <div className="d-flex">
                <p className="d-flex m-3">Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id} class="d-flex m-3">
                  Status: {table.occupied}
                </p>
                <p data-table-id-status={table.table_id} class="d-flex m-3">
                  Reservation:
                  {table.reservation_id}
                </p>
              </div>
            </div>
            <div className=" p-3 d-flex justify-content-end align-items-center">
              {table.occupied === "occupied" && (
                <button
                  data-table-id-finish={table.table_id}
                  type="button"
                  className="btn btn-danger mr-2 btn-md"
                  onClick={() => handleFreeTable(table)}
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
