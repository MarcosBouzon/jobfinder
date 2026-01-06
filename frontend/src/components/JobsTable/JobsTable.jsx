import JobTableRow from "./TableRow";
import { TableBody, TableCell, TableRow } from "@mui/material";
import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
} from "../styled/StyledComponents";

const JobsTable = (props) => {
  const jobs = props.jobs || [];
  
  return (
    <StyledTableContainer component="div">
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {jobs.map((job, index) => {
            return (
              <JobTableRow
                job={job}
                key={job.id}
                index={index + 1}
                forApplied={props.forApplied ? props.forApplied : false}
              />
            );
          })}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default JobsTable;
