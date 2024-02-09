import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Reservation from "../Reservations/Reservation";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTable } from "../utils/api";
import SeatForm from "./SeatForm";

function SeatReservation() {
  const [formData, setFormData] = useState("Please Select a table");
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
        const listedTables = await listTables(abortController.signal);
        setTables(listedTables);
        const reserved = await readReservation(reservation_id);
        setReservation(reserved);
      } catch (err) {
        setTablesError({ message: err.response.data.error });
        setReservationError({ message: err.response.data.error });
      }
      return () => abortController.abort();
    }
    loadDashboard();
  }, [reservation_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData === "Please Select a table")
        throw new Error("Please select a valid table");
      await updateTable(formData, { data: { reservation_id } });
      history.push("/dashboard");
    } catch (error) {
      if (error.response)
        setTablesError({ message: error.response.data.error });
      if (!error.response) setTablesError(error);
    }
  };
  const handleChange = (event) => {
    setFormData(event.target.value);
  };
  const handleCancel = () => {
    setFormData("Please Select a table");
    history.goBack();
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <SeatForm
          handleChange={handleChange}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          tables={tables}
        />
        <button
          onClick={handleCancel}
          className="mb-5 mt-2 btn btn-sm btn-danger"
        >
          Cancel
        </button>
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
