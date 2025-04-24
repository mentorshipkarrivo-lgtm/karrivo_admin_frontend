import React from "react";

const PageShowing = () => {
  return (
    <div className="d-flex align-items-center showing_data gap-3 justify-content-end">
      <p className="mb-0">Showing</p>
      <select
        className="form-select shadow-none"
        aria-label="Default select example"
      >
        <option value="10">10</option>
        <option value="30">30</option>
        <option value="50">50</option>
      </select>

      <div className=" d-flex align-items-center gap-1 justify-content-end">
        <label htmlFor="">Go To</label>

        <label htmlFor="">Page</label>
      </div>
    </div>
  );
};

export default PageShowing;
