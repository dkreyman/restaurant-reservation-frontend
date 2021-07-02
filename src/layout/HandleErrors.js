import React from "react";

function HandleErrors(target, formError, setFormError) {
  if (new Date(target.value).getUTCDay() === 2) {
    setFormError(
      new Map(formError.set("tuesdaysClosed", "Tuesdays are closed"))
    );
  }
  if (
    new Date(target.value).getUTCDay() !== 2 &&
    target.id === "reservation_date"
  ) {
    formError.delete("tuesdaysClosed");
    setFormError(new Map(formError));
  }
  if (new Date(target.value) < new Date()) {
    setFormError(new Map(formError.set("past", "That's in the past")));
  } else if (
    !new Date(target.value) < new Date() &&
    target.id === "reservation_date"
  ) {
    formError.delete("past");
    setFormError(new Map(formError));
  }
}

export default HandleErrors;
