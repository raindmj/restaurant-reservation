import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
  // set initial empty form data
  const initialFormDate = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialFormDate });
  const [error, setError] = useState(null);

  function handleChange(event) {
    event.preventDefault();

    if (event.target.name === "people") {
      const peopleValue = Number(event.target.value);

      setFormData({
        ...formData,
        [event.target.name]: peopleValue,
      });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  }

  const history = useHistory();

  async function handleSubmit(event) {
    //on submit, prevent page from reloading
    event.preventDefault();

    const abortController = new AbortController();

    try {
      //make call to API with POST method to create a new reservation with the form data
      const newReservation = await createReservation(
        formData,
        abortController.signal
      );

      // reformat to be YYYY-MM-DD format
      const formattedNewDate = formatAsDate(newReservation.reservation_date);

      // redirect user to the dashboard page that matches the date of the new reservation
      history.push(`/dashboard?date=${formattedNewDate}`);
    } catch (error) {
      setError(error);
    }

    return () => abortController.abort;
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <div>
      <div className="pt-3 px-2">
        <h1>Create a New Reservation</h1>
      </div>

      <hr className="bg-dark"></hr>

      <ErrorAlert error={error} />

      <div>
        <ReservationForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          formData={formData}
        />
      </div>
    </div>
  );
}

export default CreateReservation;
