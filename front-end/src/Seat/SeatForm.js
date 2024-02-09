import React from "react";

function SeatForm({ handleSubmit, handleChange, formData, tables }) {
  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="d-flex flex-column justify-content-center"
    >
      <label htmlFor="table_id">
        <select
          id="table_id"
          name="table_id"
          onChange={handleChange}
          value={formData}
        >
          <option>Please Select a table</option>
          {tables.map((table) => {
            return (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            );
          })}
        </select>
      </label>
      <button type="submit" className="btn btn-sm btn-primary">
        Submit
      </button>
    </form>
  );
}

export default SeatForm;
