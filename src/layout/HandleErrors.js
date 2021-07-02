function HandleErrors(target, formError, setFormError) {
  let formatDate = target.value.slice(5) + "-" + target.value.slice(0, 4);
  let pickedDate = new Date(formatDate);
  let pickedTime = new Date("March 13,  " + target.value);
  // Tuesdays Are Closed
  if (pickedDate.getUTCDay() === 2) {
    setFormError(
      new Map(formError.set("tuesdaysClosed", "Tuesdays are closed"))
    );
  }
  if (pickedDate.getUTCDay() !== 2 && target.id === "reservation_date") {
    formError.delete("tuesdaysClosed");
    setFormError(new Map(formError));
  }
  // Past Dates
  if (
    pickedDate.getTime() <= new Date().getTime() - 62991251 &&
    target.id === "reservation_date"
  ) {
    setFormError(new Map(formError.set("past", "That's in the past")));
  } else if (
    !(pickedDate.getTime() <= new Date().getTime() - 62991251) &&
    target.id === "reservation_date"
  ) {
    formError.delete("past");
    setFormError(new Map(formError));
  }
  //No Reservation Before 10:30
  if (
    (pickedTime.getHours() < 10 && target.id === "reservation_time") ||
    (pickedTime.getHours() === 10 &&
      pickedTime.getMinutes() < 30 &&
      target.id === "reservation_time")
  ) {
    setFormError(
      new Map(
        formError.set("10:30", "The reservation time is before 10:30 AM.")
      )
    );
  } else if (
    (pickedTime.getHours() > 10 && target.id === "reservation_time") ||
    (pickedTime.getHours() === 10 &&
      pickedTime.getMinutes() > 29 &&
      target.id === "reservation_time")
  ) {
    formError.delete("10:30");
    setFormError(new Map(formError));
  }
}

export default HandleErrors;
