import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, listReservations } from "../utils/api";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
  // set initial empty form data
  const initialFormDate = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormDate });

  function handleChange(event) {
    event.preventDefault();
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  const history = useHistory();

  async function handleSubmit(event) {
    //on submit, prevent page from reloading
    event.preventDefault();
    //make call to API with POST method to create a new reservation with the form data
    await createReservation(formData);
    //fetch updated array of reservations
    const updatedReservationsList = await listReservations();
    //new reservation added is the last in the array
    const newReservation =
      updatedReservationsList[updatedReservationsList.length - 1];
    const newReservationId = newReservation.reservation_id;
    // console.log(newReservationId)
    //redirect user to the dashboard page that matches the date of the new reservation
    history.push(`/dashboard/${newReservationId}`);
  }

  function handleCancel() {
    history.push("/");
  }

  return (
    <div>
      <h1>Create a new Reservation</h1>
      <ReservationForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        formData={formData}
      />
    </div>
  );
}

export default CreateReservation;
