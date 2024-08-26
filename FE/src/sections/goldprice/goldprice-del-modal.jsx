import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Button,  Dialog,  Typography, DialogTitle, DialogActions,   DialogContent } from '@mui/material';

export default function GoldpriceDeleteForm({ open, onClose, onDelete, goldprice }) {
  const handleDeleteClick = () => {
    onDelete(goldprice.city);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Goldprice</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">City:</Typography>
            <Typography>{goldprice.city}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Buy Price:</Typography>
            <Typography>{goldprice.buyPrice}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Sell Price:</Typography>
            <Typography>{goldprice.sellPrice}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Updated At:</Typography>
            <Typography>{goldprice.updatedAt}</Typography>
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

GoldpriceDeleteForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  goldprice: PropTypes.shape({
    city: PropTypes.string,
    buyPrice: PropTypes.number,
    sellPrice: PropTypes.number,
    updatedAt: PropTypes.string,
  }).isRequired,
};
