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
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [date, setDate] = useState(query.get("date") || today());

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

  function handleDateChange(event) {
    setDate(event.target.value);
  }

  return (
    <main className="text-center">
      <h1 className="m-3">{formatDate(date)}</h1>

      <hr className="bg-dark"></hr>

      <div>
        <Link
          to={`/dashboard?date=${previous(date)}`}
          className="btn btn-sm btn-light mx-2"
          onClick={() => setDate(previous(date))}
        >
          Previous Day
        </Link>
        <Link
          to={`/dashboard?date=${today()}`}
          className="btn btn-sm btn-light mx-2"
          onClick={() => setDate(today())}
        >
          Today
        </Link>
        <Link
          to={`/dashboard?date=${next(date)}`}
          className="btn btn-sm btn-light mx-2"
          onClick={() => setDate(next(date))}
        >
          Next Day
        </Link>
      </div>

      <label htmlFor="reservation_date" className="form-label m-3">
        <input
          type="date"
          pattern="\d{4}-\d{2}-\d{2}"
          name="reservation_date"
          onChange={handleDateChange}
          value={date}
        />
      </label>

      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />

      <div className="mb-4 p-3">
        <h3>Tables</h3>
        {tables.length ? (
          <div>
            <div className="d-flex justify-content-center mb-1 flex-wrap">
              <TablesList tables={tables} />
            </div>
          </div>
        ) : (
          <h5>Loading tables...</h5>
        )}
      </div>

      <div className="mb-4 p-3">
        <h3>Reservations</h3>
        {reservations.length ? (
          <div className="d-flex justify-content-center flex-wrap">
            <ReservationsList reservations={reservations} />
          </div>
        ) : (
          <h5>No reservations for {date}</h5>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
