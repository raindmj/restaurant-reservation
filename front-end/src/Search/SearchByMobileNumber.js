import React, { useState } from "react";
import ReservationsList from "../Reservations/ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import SearchForm from "./SearchForm";

function SearchByMobileNumber() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function handleChange(event) {
    setMobileNumber(event.target.value);
  }

  async function handleSearch(event) {
    event.preventDefault();

    const abortController = new AbortController();

    try {
      const data = await listReservations(
        { mobile_number: mobileNumber },
        abortController.signal
      );

      setReservations(data);

      if (!reservations.length) {
        setReservationsError({ message: "No reservations found" });
      }
    } catch (error) {
      setReservationsError(error);
    }
  }

  return (
    <div>
      <div className="row justify-content-center pt-3 px-2">
        <h1 className="mb-0">Search for Reservation(s)</h1>
      </div>

      <hr className="bg-dark"></hr>

      <div className="row justify-content-center">
        <SearchForm
          handleSearch={handleSearch}
          handleChange={handleChange}
          mobile_number={mobileNumber}
        />
      </div>

      {reservations.length ? (
        <div>
          <h3 className="mt-2 row justify-content-center">Reservations</h3>
          <ReservationsList reservations={reservations} />
        </div>
      ) : (
        <ErrorAlert error={reservationsError} />
      )}
    </div>
  );
}

export default SearchByMobileNumber;
