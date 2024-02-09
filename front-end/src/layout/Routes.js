import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import CreateReservation from "../Reservations/CreateReservation";
import EditReservation from "../Reservations/EditReservation";
import Dashboard from "../dashboard/Dashboard";
import { today } from "../utils/date-time";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      {/* TODO: edit a reservation component */}
      <Route path="reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      {/* TODO: seat component */}
      <Route path="reservations/:reservation_id/seat"></Route>
      {/* TODO: create new table component */}
      <Route path="/tables/new"></Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      {/* TODO: search by mobile number component */}
      <Route path="/search"></Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
