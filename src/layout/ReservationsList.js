import React from "react";
import { Link } from "react-router-dom";

function ReservationsList(props) {
  if (!props.reservations.length) {
    return (
      <div className="d-md-flex mb-3 m-3">
        <h4 className="mb-0">No reservations found</h4>
      </div>
    );
  }
  return props.reservations.map((reservation) => {
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
  });
}
export default ReservationsList;
