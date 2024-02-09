import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const [currentReservation, setCurrentReservation] = useState({});

  const params = useParams();
  // console.log(params);
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
    name: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  // console.log(formData)

  function handleChange(event) {
    event.preventDefault();
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  const history = useHistory();

  async function handleSubmit(event) {
    event.preventDefault();
    await updateReservation(formData);
    history.push(`/reservations/${reservation_id}`);
  }

  function handleCancel() {
    history.push(`/reservations/${reservation_id}`);
  }

  if (currentReservation.id) {
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
