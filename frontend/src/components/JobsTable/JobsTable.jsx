import TableRow from "./TableRow";
import classes from "./JobsTable.module.css";
import { useState } from "react";

const JobsTable = (props) => {

  return (
    <div className={classes["table-wrapper"]}>
      <table className={classes.table}>
        <thead className={classes.head}>
          <tr>
            <td>#</td>
            <td>Title</td>
            <td>Salary</td>
            <td>Company</td>
            <td>Applied Date</td>
            <td>Platform</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {props.jobs.map((job, index) => {
            return (
              <TableRow
                job={job}
                key={job.id}
                index={index + 1}
                forApplied={props.forApplied ? props.forApplied : false}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
