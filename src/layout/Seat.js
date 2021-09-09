import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { assignReservation } from "../utils/api";
function Seat() {
  const initialFormState = {
    table_id: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [formError, setFormError] = useState();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState();
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  function getTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => {
      abortController.abort();
    };
  }
  useEffect(getTables, []);

  function selectItems(tables) {
    let items = [];
    tables.forEach((table) => {
      items.push(
        <option value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    });
    return items;
  }
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const myUrl = new URL(document.location).pathname.split("/");
    const reservation_id = parseInt(myUrl[2]);
    console.log("form", reservation_id);
    assignReservation({ data: { reservation_id } }, formData.table_id)
      .then((res) => {
        history.push("/dashboard");
        setFormData({ ...initialFormState });
        setFormError();
      })
      .catch((err) => setFormError(err));
    console.log(formError);
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
              Seat Party
            </li>
          </ol>
        </nav>
        <h1>Seat Party</h1>
      </div>
      {ErrorAlert(formError)}
      {ErrorAlert(tablesError)}
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="table_id">
              Tables:
              <select
                id="table_id"
                name="table_id"
                onChange={handleChange}
                value={formData.table_id}
              >
                <option value="">-- Select an Option --</option>
                {selectItems(tables)}
              </select>
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
export default Seat;
