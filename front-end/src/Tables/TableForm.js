import React from "react";

function TableForm({ handleSubmit, handleChange, handleCancel, formData }) {
  return (
    <form onSubmit={handleSubmit} className="pb-3 pt-2 px-2">
      <div className="form-group">
        <label htmlFor="table_name" className="form-label mr-2">
          Table Name:
        </label>
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
      <div className="form-group">
        <label htmlFor="capacity" className="form-label mr-2">
          Capacity:
        </label>
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
        className="btn btn-danger mr-2"
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
