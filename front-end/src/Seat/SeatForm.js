import React from "react";

function SeatForm({
  handleSubmit,
  handleChange,
  handleCancel,
  formData,
  tables,
}) {
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
          <option>Please select a table</option>
          {tables.map((table) => {
            return (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            );
          })}
        </select>
      </label>

      <div className="row pb-4 pt-2 m-0">
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-danger btn-sm mr-2 col"
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-sm btn-primary col">
          Submit
        </button>
      </div>
    </form>
  );
}

export default SeatForm;
