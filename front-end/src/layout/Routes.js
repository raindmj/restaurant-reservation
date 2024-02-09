import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import CreateReservation from "../Reservations/CreateReservation";
import EditReservation from "../Reservations/EditReservation";
import SearchByMobileNumber from "../Search/SearchByMobileNumber";
import SeatReservation from "../Seat/SeatReservation";
import CreateTable from "../Tables/CreateTable";
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
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/search">
        <SearchByMobileNumber />
      </Route>
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
