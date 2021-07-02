import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
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
            </div>
            <div class=" p-3 d-flex justify-content-end align-items-center">
              <Link
                to={`/reservations/${reservation.reservation_id}/edit`}
                type="button"
                className="btn btn-secondary mr-2 btn-md"
              >
                Edit
              </Link>
            </div>
          </div>
        );
      })}
    </main>
  );
}

export default Dashboard;
