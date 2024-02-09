import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";

function CreateTable() {
  // set initial empty form data
  const initialFormDate = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormDate });
  const [error, setError] = useState(null);

  function handleChange(event) {
    event.preventDefault();

    if (event.target.name === "capacity") {
      event.target.value = Number(event.target.value);
    }

    // console.log(event.target.name);
    console.log(event.target.value);
    console.log(typeof event.target.value);

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  const history = useHistory();

  async function handleSubmit(event) {
    //on submit, prevent page from reloading
    event.preventDefault();

    const abortController = new AbortController();

    try {
      //make call to API with POST method to create a new reservation with the form data
      await createTable(formData, abortController.signal);
      // redirect user to the dashboard page that matches the date of the new reservation
      history.push("/dashboard");
    } catch (error) {
      setError(error);
    }

    return () => abortController.abort;
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <div>
      <div>
        <h1>Create a New Table</h1>
        <ErrorAlert error={error} />
      </div>

      <TableForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        formData={formData}
      />
    </div>
  );
}

export default CreateTable;
