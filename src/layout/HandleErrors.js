function HandleErrors(reservation, formError, setFormError) {
  //No Reservation After 9:30pm
  console.log(reservation.status);
  if (reservation.status !== "booked") {
    setFormError(
      new Map(
        formError.set(
          "notbooked",
          "Only status booked reservations can be edited"
        )
      )
    );
  } else if (reservation.status === "booked") {
    formError.delete("notbooked");
    setFormError(new Map(formError));
  }
}

export default HandleErrors;
