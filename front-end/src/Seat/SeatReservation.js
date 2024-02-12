import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Reservation from "../Reservations/Reservation";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTable } from "../utils/api";
import SeatForm from "./SeatForm";

function SeatReservation() {
  const [formData, setFormData] = useState("Please select a table");
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);

  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    async function loadDashboard() {
      const abortController = new AbortController();

      setTablesError(null);
      setReservationError(null);

      try {
        const tablesData = await listTables(abortController.signal);
        setTables(tablesData);

        const reservationData = await readReservation(
          reservation_id,
          abortController.signal
        );

        setReservation(reservationData);
      } catch (error) {
        setTablesError({ message: error.response.data.error });
        setReservationError({ message: error.response.data.error });
      }

      return () => abortController.abort();
    }

    loadDashboard();
  }, [reservation_id]);

  async function handleSubmit(event) {
    event.preventDefault();

    const abortController = new AbortController();

    try {
      if (formData === "Please select a table")
        throw new Error("Please select a valid table");

      await updateTable(formData, reservation_id, abortController.signal);

      history.push("/dashboard");
    } catch (error) {
      if (error.response)
        setTablesError({ message: error.response.data.error });
      if (!error.response) setTablesError(error);
    }
  }

  function handleChange(event) {
    setFormData(event.target.value);
  }

  function handleCancel() {
    setFormData("Please select a table");
    history.goBack();
  }
  console.log(formData);

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <SeatForm
          handleChange={handleChange}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          formData={formData}
          tables={tables}
        />

        {reservation.reservation_time && (
          <Reservation reservation={reservation} />
        )}

        <ErrorAlert error={tablesError} />
        <ErrorAlert error={reservationError} />
      </div>
    </>
  );
}

export default SeatReservation;
