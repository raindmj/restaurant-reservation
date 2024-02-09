import React, { useState } from "react";
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
      const data = await listReservations(mobileNumber, abortController.signal);
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
      <SearchForm
        handleSearch={handleSearch}
        handleChange={handleChange}
        mobile_number={mobileNumber}
      />
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default SearchByMobileNumber;
