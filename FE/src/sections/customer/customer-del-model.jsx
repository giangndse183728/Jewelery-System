import React from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function CustomerDeleteForm({ open, onClose, onDelete, customer }) {
  const handleDeleteClick = () => {
    onDelete(customer.customerId);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Customer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Code:</Typography>
            <Typography>{customer.code}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Name:</Typography>
            <Typography>{customer.fullName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Address:</Typography>
            <Typography>{customer.address}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Phone Number:</Typography>
            <Typography>{customer.phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Point:</Typography>
            <Typography>{customer.point}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Gender:</Typography>
            <Typography>{customer.gender}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDeleteClick} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CustomerDeleteForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
};
