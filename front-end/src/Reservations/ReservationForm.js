import React from "react";

function ReservationForm({
  handleSubmit,
  handleChange,
  handleCancel,
  formData,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          placeholder="Deck Name"
          value={formData.name}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          type="text"
          rows={4}
          onChange={handleChange}
          placeholder="Brief description of the deck"
          value={formData.description}
          className="form-control"
          required
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

export default ReservationForm;
