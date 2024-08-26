import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function GoldPriceForm({ open, onClose, onSubmit }) {
    const initialFormState = {
        city: '',
        buyPrice: '',
        sellPrice: '',
        type: '',
        lastUpdated: '',
    };

    const [formState, setFormState] = useState(initialFormState);

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formState);
        setFormState(initialFormState);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Gold Price</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="city"
                    label="City"
                    type="text"
                    fullWidth
                    value={formState.city}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    name="buyPrice"
                    label="Buy Price"
                    type="text"
                    fullWidth
                    value={formState.buyPrice}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    name="sellPrice"
                    label="Sell Price"
                    type="text"
                    fullWidth
                    value={formState.sellPrice}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    name="type"
                    label="Type"
                    type="text"
                    fullWidth
                    value={formState.type}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    name="lastUpdated"
                    label="Last Updated"
                    type="text"
                    fullWidth
                    value={formState.lastUpdated}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

GoldPriceForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default GoldPriceForm;
