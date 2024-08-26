import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import { FormControl, Box, Typography } from '@mui/material';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';

function CrateCounterForm({ open, onClose, onSubmit, counters }) {
    const initialFormState = {
        name: '', // số quầy
        users: [], // danh sách user phụ trách
    };

    const [formState, setFormState] = React.useState(initialFormState);
    // const [users, setUsers] = React.useState([]);

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    // const handleUsersChange = (event, value) => {
    //   setFormState({ ...formState, users: value });
    // };
    const validate = () => {
        if (!formState.name) {
            toast.error('Name is required');
            return false;
        }
        console.log('counters', counters);
        if (counters.some((counter) => counter.name === formState.name)) {
            toast.error('Name already exists');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động submit mặc định của form
        if (validate()) {
            await onSubmit(formState); // Gọi addPromotion
            setFormState(initialFormState); // Clear các trường của form sau khi submit
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="form-modal-title">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="form-modal-title" variant="h6" component="h2">
                    Create Counter
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Number"
                        type="text"
                        fullWidth
                        value={formState.name}
                        onChange={handleChange}
                    />
                    {/* <FormControl fullWidth className="mt-3">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={users}
              onChange={handleUsersChange}
              getOptionLabel={(option) => option.fullName || option.email}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} label="Users" placeholder="Users" />}
            />
          </FormControl> */}
                    <Box sx={{ mt: 2 }}>
                        <Button onClick={onClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}

CrateCounterForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    counters: PropTypes.array.isRequired,
};

export default CrateCounterForm;
