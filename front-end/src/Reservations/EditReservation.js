import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const [currentReservation, setCurrentReservation] = useState({});

  const params = useParams();
  //   console.log(params);
  const reservation_id = params.reservation_id;

  useEffect(() => {
    async function getReservation() {
      const data = await readReservation(reservation_id);
      setCurrentReservation(data);
      setFormData(data);
    }
    getReservation();
  }, [reservation_id]);

  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  // console.log(formData)

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
    event.preventDefault();
    await updateReservation(formData);
    history.goBack();
  }

  function handleCancel() {
    history.goBack();
  }

  if (currentReservation.reservation_id) {
    return (
      <div className="pb-4">
        <h1>Edit Reservation</h1>
        <ReservationForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          formData={formData}
        />
      </div>
    );
  } else {
    return "Loading...";
  }
}

export default EditReservation;
