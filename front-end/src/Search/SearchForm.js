import React from "react";

function SearchForm({ handleSearch, handleChange, mobile_number }) {
  return (
    <form onSubmit={handleSearch} className="row">
      <div className="col-auto align-self-center">
        <label htmlFor="mobile_number" className="form-label mr-2">
          Mobile Number:
        </label>
        <input
          style={{ width: 250 }}
          id="mobile_number"
          name="mobile_number"
          type="text"
          required={true}
          placeholder="Enter a customer's phone number"
          value={mobile_number}
          maxLength="12"
          onChange={handleChange}
        />
      </div>
      <div className="col-auto align-self-center">
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
