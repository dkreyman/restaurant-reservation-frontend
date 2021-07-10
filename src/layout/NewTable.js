import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
function NewTable() {
  const initialFormState = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [formError, setFormError] = useState();
  const handleChange = ({ target }) => {
    if (target.name === "capacity") {
      setFormData({
        ...formData,
        [target.name]: parseInt(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    createTable({ data: formData })
      .then((res) => {
        history.push("/dashboard");
        setFormData({ ...initialFormState });
        setFormError();
      })
      .catch((err) => setFormError(err));
  };
  const goToPreviousPath = () => {
    setFormData({ ...initialFormState });
    history.goBack();
  };

  return (
    <>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              New Table
            </li>
          </ol>
        </nav>
        <h1>New Table</h1>
      </div>
      {ErrorAlert(formError)}
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="table_name">
              Table Name:
              <input
                className="form-control d-inline"
                id="table_name"
                type="text"
                name="table_name"
                placeholder="Table Name"
                onChange={handleChange}
                value={formData.table_name}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="capacity">
              Capacity:
              <input
                className="form-control d-inline"
                id="capacity"
                type="number"
                name="capacity"
                placeholder="Capacity"
                onChange={handleChange}
                value={formData.capacity}
              />
            </label>
          </div>
          <br />
          <button
            type="button"
            className="btn btn-secondary btn-md mr-2"
            onClick={goToPreviousPath}
          >
            Cancel
          </button>
          <button className="btn btn-primary btn-md" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
export default NewTable;
