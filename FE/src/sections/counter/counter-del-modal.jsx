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

export default function CounterDeleteForm({ open, onClose, onDelete, counter }) {
    const handleDeleteClick = () => {
        onDelete(counter);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Counter</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Counter:</Typography>
                        <Typography>{counter.name}</Typography>
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

CounterDeleteForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    counter: PropTypes.object,
};
