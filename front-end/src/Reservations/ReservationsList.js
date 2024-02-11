import React from "react";
import Reservation from "./Reservation";

function ReservationsList({ reservations }) {
  return (
    <div className="mb-4 row justify-content-center">
      {/* map through the reservations list to access each individual reservation and display its component */}
      {reservations.map((reservation) => (
        <Reservation
          reservation={reservation}
          key={reservation.reservation_id}
        />
      ))}
    </div>
  );
}

export default ReservationsList;
