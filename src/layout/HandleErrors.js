function HandleErrors(target, formError, setFormError) {
  //   let formatDate =
  //     target.value.slice(5) +
  //     "-" +
  //     target.value.slice(0, 4);
  //   let pickedDate = new Date(formatDate);
  //   let timeFormat = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  //   let dateFormat = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/;
  //   let formatTime = target.value.split(":");
  //   let pickedTime = new Date().setHours(formatTime[0], formatTime[1]);
  // // Tuesdays Are Closed
  // if (pickedDate.getUTCDay() === 2) {
  //   setFormError(
  //     new Map(formError.set("tuesdaysClosed", "Tuesdays are closed"))
  //   );
  // }
  // if (pickedDate.getUTCDay() !== 2 && target.id === "reservation_date") {
  //   formError.delete("tuesdaysClosed");
  //   setFormError(new Map(formError));
  // }
  // //No Reservation After 9:30pm
  // if (
  //   (formatTime[0] > 21 && target.id === "reservation_time") ||
  //   (formatTime[0] === 21 &&
  //     formatTime[1] > 30 &&
  //     target.id === "reservation_time")
  // ) {
  //   setFormError(
  //     new Map(formError.set("9:30PM", "The reservation time is after 9:30 PM."))
  //   );
  // } else if (
  //   (formatTime[0] < 21 && target.id === "reservation_time") ||
  //   (formatTime[0] === 21 &&
  //     formatTime[1] < 29 &&
  //     target.id === "reservation_time")
  // ) {
  //   formError.delete("9:30PM");
  //   setFormError(new Map(formError));
  // }
  // //No Reservation Before 10:30
  // if (
  //   (formatTime[0] < 10 && target.id === "reservation_time") ||
  //   (formatTime[0] === 10 &&
  //     formatTime[1] < 30 &&
  //     target.id === "reservation_time")
  // ) {
  //   setFormError(
  //     new Map(
  //       formError.set("10:30", "The reservation time is before 10:30 AM.")
  //     )
  //   );
  // } else if (
  //   (formatTime[0] > 10 && target.id === "reservation_time") ||
  //   (formatTime[0] === 10 &&
  //     formatTime[1] > 29 &&
  //     target.id === "reservation_time")
  // ) {
  //   formError.delete("10:30");
  //   setFormError(new Map(formError));
  // }
  // // Past Dates
  // if (
  //   pickedDate.getTime() <= new Date().getTime() - 62991251 &&
  //   target.id === "reservation_date"
  // ) {
  //   setFormError(new Map(formError.set("pastDay", "That's in the past")));
  // } else if (
  //   !(pickedDate.getTime() <= new Date().getTime() - 62991251) &&
  //   target.id === "reservation_date"
  // ) {
  //   formError.delete("pastDay");
  //   setFormError(new Map(formError));
  // }
  //   // Past Time
  //   if (
  //     pickedDate.getTime() <= new Date().getTime() &&
  //     pickedTime <= new Date().getTime()
  //   ) {
  //     new Map(
  //       formError.set("pastTime", "Pick a time in the future")
  //     )
  //   }else if(pickedDate.getTime() <= new Date().getTime() &&
  //   pickedTime >= new Date().getTime()){
  //     formError.delete("pastTime");
  //     setFormError(new Map(formError))
  //   }
  //   return next();
  // }

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
    setFormError(new Map(formError.set("past", "That day is in the past")));
  } else if (
    !(pickedDate.getTime() <= new Date().getTime() - 62991251) &&
    target.id === "reservation_date"
  ) {
    formError.delete("past");
    setFormError(new Map(formError));
  }
  // Past Time - 62991251 is some kind of timezone offset
  if (
    pickedTime.getTime() <= new Date().getTime() - 62991251 &&
    target.id === "reservation_time"
  ) {
    setFormError(new Map(formError.set("past", "That time is in the past")));
  } else if (
    pickedTime.getTime() >= new Date().getTime() &&
    target.id === "reservation_time"
  ) {
    formError.delete("past");
    setFormError(new Map(formError));
  }
  //No Reservation Before 10:30AM
  if (
    (pickedTime.getHours() < 10 && target.id === "reservation_time") ||
    (pickedTime.getHours() === 10 &&
      pickedTime.getMinutes() < 30 &&
      target.id === "reservation_time")
  ) {
    setFormError(
      new Map(
        formError.set("10:30AM", "The reservation time is before 10:30 AM.")
      )
    );
  } else if (
    (pickedTime.getHours() > 10 && target.id === "reservation_time") ||
    (pickedTime.getHours() === 10 &&
      pickedTime.getMinutes() > 29 &&
      target.id === "reservation_time")
  ) {
    formError.delete("10:30AM");
    setFormError(new Map(formError));
  }
  //No Reservation After 9:30pm
  if (
    (pickedTime.getHours() > 21 && target.id === "reservation_time") ||
    (pickedTime.getHours() === 21 &&
      pickedTime.getMinutes() > 30 &&
      target.id === "reservation_time")
  ) {
    setFormError(
      new Map(formError.set("9:30PM", "The reservation time is after 9:30 PM."))
    );
  } else if (
    (pickedTime.getHours() < 21 && target.id === "reservation_time") ||
    (pickedTime.getHours() === 21 &&
      pickedTime.getMinutes() < 29 &&
      target.id === "reservation_time")
  ) {
    formError.delete("9:30PM");
    setFormError(new Map(formError));
  }
}

export default HandleErrors;
