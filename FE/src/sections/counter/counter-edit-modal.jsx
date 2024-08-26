import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'react-toastify';

function StaffEditForm({ open, onClose, onSubmit, counter }) {
    const [formState, setFormState] = useState(counter);

    const handleChange = (event) => {
        setFormState({ ...formState, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // nếu trống tên counter thì thông báo
        if (!formState.name) {
            toast.error('Please enter counter name');
            return;
        }
        await onSubmit(formState);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Counter</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Counter Name"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={formState.name}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

StaffEditForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    counter: PropTypes.object,
};

export default StaffEditForm;
