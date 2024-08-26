import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

function GoldpriceEditForm({ open, onClose, onSubmit, goldprice }) {
  const [formState, setFormState] = React.useState({
    city: goldprice ? goldprice.city : '',
    buyPrice: goldprice ? goldprice.buyPrice : '',
    sellPrice: goldprice ? goldprice.sellPrice : '',
    type: goldprice ? goldprice.type : '',
    lastUpdated: goldprice ? goldprice.lastUpdated : '',
  });

  React.useEffect(() => {
    if (goldprice) {
      setFormState({
        city: goldprice.city,
        buyPrice: goldprice.buyPrice,
        sellPrice: goldprice.sellPrice,
        type: goldprice.type,
        lastUpdated: goldprice.lastUpdated,
      });
    }
  }, [goldprice]);

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Gold Price</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="city"
          label="City"
          type="text"
          fullWidth
          onChange={handleChange}
          value={formState.city}
        />

        <TextField
          margin="dense"
          name="buyPrice"
          label="Buy Price"
          type="number"
          fullWidth
          onChange={handleChange}
          value={formState.buyPrice}
        />

        <TextField
          margin="dense"
          name="sellPrice"
          label="Sell Price"
          type="number"
          fullWidth
          onChange={handleChange}
          value={formState.sellPrice}
        />

        <TextField
          margin="dense"
          name="type"
          label="Type"
          type="text"
          fullWidth
          onChange={handleChange}
          value={formState.type}
        />

        <TextField
          margin="dense"
          name="lastUpdated"
          label="Last Updated"
          type="datetime-local"
          fullWidth
          onChange={handleChange}
          value={formState.lastUpdated}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

GoldpriceEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  goldprice: PropTypes.shape({
    city: PropTypes.string,
    buyPrice: PropTypes.number,
    sellPrice: PropTypes.number,
    type: PropTypes.string,
    lastUpdated: PropTypes.string,
  }),
};

export default GoldpriceEditForm;
