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

export default function PromotionDeleteForm({ open, onClose, onDelete, promotion }) {
  const handleDeleteClick = () => {
    onDelete(promotion.promotionId);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Promotion</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Promotion</Typography>
            <Typography>{promotion.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Start Date:</Typography>
            <Typography>{promotion.startDate}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">End Date:</Typography>
            <Typography>{promotion.endDate}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">DiscountRate:</Typography>
            <Typography>{`${promotion.discountRate}%`}</Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <Typography variant="h6">Approval Manager:</Typography>
            <Typography>{promotion.approveManager}</Typography>
          </Grid> */}
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

PromotionDeleteForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  promotion: PropTypes.shape({
    promotionId: PropTypes.any,
    type: PropTypes.string,
    approveManager: PropTypes.string,
    description: PropTypes.string,
    discountRate: PropTypes.number,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }).isRequired,
};
