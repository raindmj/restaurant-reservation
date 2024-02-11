import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReservationsList from "../Reservations/ReservationsList";
import TablesList from "../Tables/TablesList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, listTables } from "../utils/api";
import { formatDate, next, previous, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();
  const date = query.get("date") || today();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main className="text-center">
      <h1 className="m-3">{formatDate(date)}</h1>
      <Link
        to={`/dashboard?date=${previous(date)}`}
        // onClick={() => setDate(previous(date))}
        className="btn btn-sm btn-light"
      >
        Previous Day
      </Link>
      <Link
        to={`/dashboard?date=${today()}`}
        // onClick={() => setDate(previous(date))}
        className="btn btn-sm btn-light"
      >
        Today
      </Link>
      <Link
        to={`/dashboard?date=${next(date)}`}
        // onClick={() => setDate(previous(date))}
        className="btn btn-sm btn-light"
      >
        Next Day
      </Link>
      <br />
      {/* <label htmlFor="reservation_date" className="form-label m-3">
        <input
          type="date"
          pattern="\d{4}-\d{2}-\d{2}"
          name="reservation_date"
          onChange={handleDateChange}
          value={date}
        />
      </label> */}
      <div className="d-md-flex mb-3 "></div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <h3>Tables </h3>
      <div className="d-flex justify-content-center mb-1 flex-wrap">
        <TablesList tables={tables} />
      </div>
      {reservations.length ? (
        <h3>Reservations</h3>
      ) : (
        `No reservations for ${date}`
      )}
      <div className="d-flex justify-content-center flex-wrap">
        <ReservationsList reservations={reservations} />
      </div>
    </main>
  );
}

export default Dashboard;
