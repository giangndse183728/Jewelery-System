import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Button, Dialog ,Typography,DialogTitle ,DialogContent, DialogActions } from '@mui/material';

export default function StaffDeleteForm({ open, onClose, onDelete, staff }) {
  const handleDeleteClick = () => {
    onDelete(staff.staffId);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Staff</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Staff ID:</Typography>
            <Typography>{staff.staffId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Code:</Typography>
            <Typography>{staff.code}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Password:</Typography>
            <Typography>{staff.password}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Email:</Typography>
            <Typography>{staff.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Role ID:</Typography>
            <Typography>{staff.roleId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Counter ID:</Typography>
            <Typography>{staff.counterId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Status:</Typography>
            <Typography>{staff.status}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant='contained' onClick={handleDeleteClick} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

StaffDeleteForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  staff: PropTypes.shape({
    staffId: PropTypes.string,
    code: PropTypes.string,
    email: PropTypes.string,
    roleId: PropTypes.string,
    counterId: PropTypes.number,
    status: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
};