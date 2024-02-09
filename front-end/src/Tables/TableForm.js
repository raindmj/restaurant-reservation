import React from "react";

function TableForm({ handleSubmit, handleChange, handleCancel, formData }) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="table_name">Table Name:</label>
        <input
          id="table_name"
          name="table_name"
          type="text"
          required={true}
          value={formData.table_name}
          maxLength="100"
          minLength="2"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="capacity">Capacity:</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          required={true}
          value={formData.capacity}
          min={1}
          onChange={handleChange}
        />
      </div>
      <button
        type="button"
        onClick={handleCancel}
        className="btn btn-secondary mr-2"
      >
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default TableForm;
