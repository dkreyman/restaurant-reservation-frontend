import React, { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import { updateResStatus } from "../utils/api";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

function ReservationsList(props) {
  const [reservationsError, setReservationsError] = useState();
  const history = useHistory();

  let handleCancelRes = (reservation) => {
    let cancel = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (cancel === true) {
      const abortControllerStat = new AbortController();

      updateResStatus(
        reservation.reservation_id,
        "cancelled",
        abortControllerStat.signal
      )
        .then((res) => res)
        .catch(setReservationsError);
      history.go(0);
      return () => {
        abortControllerStat.abort();
      };
    }
  };
  if (!props.reservations.length && props.submited) {
    return (
      <div className="d-md-flex mb-3 m-3">
        <h4 className="mb-0">No reservations found</h4>
      </div>
    );
  }
  return props.reservations.map((reservation) => {
    return (
      <>
        {ErrorAlert(reservationsError)}
        <div key={reservation.reservation_id} className="card mt-2 pt-3">
          <div className="card-body">
            <h3 className="d-flex m-3">
              {reservation.first_name} {reservation.last_name}
            </h3>
            <div className="d-flex">
              <p className="d-flex m-3">Time: {reservation.reservation_time}</p>
              <p className="d-flex m-3">People: {reservation.people}</p>
            </div>
            <div className="d-flex">
              <p className="d-flex m-3">Phone #: {reservation.mobile_number}</p>
              <p className="d-flex m-3">Date: {reservation.reservation_date}</p>
            </div>
            <div className="d-flex">
              <p
                data-reservation-id-status={reservation.reservation_id}
                className="d-flex m-3"
              >
                Status: {reservation.status}
              </p>
              <p className="d-flex m-3">
                Reservation #: {reservation.reservation_id}
              </p>
            </div>
          </div>
          <div className=" p-3 d-flex justify-content-end align-items-center">
            {reservation.status === "booked" && (
              <>
                <Link
                  to={`/reservations/${reservation.reservation_id}/edit`}
                  type="button"
                  className="btn btn-secondary mr-2 btn-md"
                >
                  Edit
                </Link>

                <Link
                  to={`/reservations/${reservation.reservation_id}/seat`}
                  type="button"
                  className="btn btn-secondary mr-2 btn-md"
                >
                  Seat
                </Link>
              </>
            )}
            {reservation.status !== "cancelled" &&
              reservation.status !== "finished" && (
                <div className=" p-3 d-flex justify-content-end align-items-center">
                  <button
                    data-reservation-id-cancel={reservation.reservation_id}
                    type="button"
                    className="btn btn-danger mr-2 btn-md"
                    onClick={() => handleCancelRes(reservation)}
                  >
                    Cancel
                  </button>
                </div>
              )}
          </div>
        </div>
      </>
    );
  });
}
export default ReservationsList;
