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
        <label htmlFor="first_name">First Name:</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required={true}
          value={formData.first_name}
          maxLength="100"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="last_name">Last Name:</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required={true}
          value={formData.last_name}
          maxLength="100"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          id="mobile_number"
          name="mobile_number"
          type="text"
          placeholder="000-000-0000"
          required={true}
          value={formData.mobile_number}
          maxLength="100"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="reservation_date">Reservation Date:</label>
        <input
          id="reservation_date"
          name="reservation_date"
          type="date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          required={true}
          value={formData.reservation_date}
          maxLength="100"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="reservation_time">Reservation Time:</label>
        <input
          id="reservation_time"
          name="reservation_time"
          type="time"
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
          required={true}
          value={formData.reservation_time}
          maxLength="100"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="people">Number of People:</label>
        <input
          id="people"
          name="people"
          type="number"
          required={true}
          value={formData.people}
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

export default ReservationForm;
