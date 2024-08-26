import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { InputLabel, FormControl, Autocomplete } from '@mui/material';
import CommonFunction from 'src/utils/commonFunction';
import request from 'src/request';

function StaffEditForm({ open, onClose, onSubmit, staff }) {
    const [counters, setCounters] = useState([]);
    const [formState, setFormState] = useState({
        userId: '',
        roleId: '',
        fullName: '',
        phoneNumber: '',
        code: '',
        email: '',
        password: '',
        counterId: '',
        status: '',
        gender: '',
    });

    useEffect(() => {
        if (staff) {
            Object.assign(formState, staff);
            setFormState({ ...formState });
        }
        fetchCounters();
    }, [staff]);

    const handleChange = (event) => {
        setFormState({ ...formState, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        formState.status = formState.status === 'true';
        await onSubmit(formState);
    };

    const fetchCounters = async () => {
        const response = await request.get('Counter/GetCounters');
        const data = response.data;
        const res = data.map((item) => ({ label: item.name, value: item.counterId }));
        setCounters(res);
    };
    const role = localStorage.getItem('ROLE');
    CommonFunction.getRoleName(formState.roleId);

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogContent>
                <TextField
                    margin="dense"
                    name="code"
                    label="Code"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={formState.code}
                    disabled
                />

                <TextField
                    margin="dense"
                    name="fullName"
                    label="Full Name"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={formState.fullName}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        name="gender"
                        label="Role"
                        value={formState.gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="Male">Male </MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    margin="dense"
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    value={formState.phoneNumber}
                />

                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    disabled
                    onChange={handleChange}
                    value={formState.email}
                />
                {!(role === '2' || role === '1') &&
                    CommonFunction.getRoleName(formState.roleId) && (
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                name="roleId"
                                label="Role"
                                value={formState.roleId}
                                onChange={handleChange}
                            >
                                {/* <MenuItem value="1">Admin</MenuItem>
                   <MenuItem value="2">Manager</MenuItem> */}
                                <MenuItem value="3">Staff</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                {CommonFunction.getRoleName(formState.roleId) === 'Staff' && (
                    <Autocomplete
                        disablePortal
                        id="counterId"
                        options={counters}
                        value={
                            counters.find((option) => option.value === formState.counterId) || null
                        }
                        onChange={(event, newValue) => {
                            setFormState({ ...formState, counterId: newValue?.value });
                        }}
                        renderInput={(params) => <TextField {...params} label="Counter" />}
                    />
                )}
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        name="status"
                        label="Status"
                        value={formState.status}
                        onChange={handleChange}
                    >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                </FormControl>
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
    staff: PropTypes.object,
};

export default StaffEditForm;
