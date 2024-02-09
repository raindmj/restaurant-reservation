import React from "react";

function SearchForm({ handleSearch, handleChange, mobile_number }) {
  return (
    <form onSubmit={handleSearch}>
      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
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
      <button type="submit" className="btn btn-primary">
        Find
      </button>
    </form>
  );
}

export default SearchForm;
