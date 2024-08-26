import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Grid, Button, Dialog, Typography, DialogContent, DialogActions } from '@mui/material';
import CommonFunction from 'src/utils/commonFunction';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { toast } from 'react-toastify';
import axios from 'axios';
import request from 'src/request';
import StaffEditForm from './staff-edit-modal';
import StaffDeleteForm from './staff-del-modal';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, row, handleClick, status, onReload }) {
    const [open, setOpen] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleEditOpen = () => {
        setEditOpen(true);
        handleCloseMenu();
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const onSubmit = async (updatedData) => {
        try {
            const response = await request.put(`User/UpdateUser/${row.userId}`, updatedData);
            if (response.status === 200) {
                toast.success('Staff updated successfully');
                handleEditClose();
                onReload();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
        handleCloseMenu();
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        handleCloseMenu();
    };

    const onDelete = async () => {
        try {
            const response = await request.delete(`User/DeleteUser/${row.userId}`);
            if (response.status === 200) {
                toast.success('Staff deleted successfully');
                handleDeleteClose();
                onReload();
            }
        } catch (error) {
            toast.error(error.message);
        }
        handleDeleteClose();
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell>{row.code}</TableCell>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{CommonFunction.getRoleName(row.roleId)}</TableCell>
                <TableCell>{row.counterName}</TableCell>
                <TableCell>
                    <Label
                        variant={row.status ? 'ghost' : 'filled'}
                        color={row.status ? 'success' : 'error'}
                    >
                        {row.status ? 'Active' : 'Inactive'}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <Button variant="outlined" onClick={handleDialogOpen}>
                        More Info
                    </Button>
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Code:</Typography>
                            <Typography>{row.code}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Full Name:</Typography>
                            <Typography>{row.fullName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Gender:</Typography>
                            <Typography>{row.gender}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Phone Number:</Typography>
                            <Typography>{row.phoneNumber}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Email:</Typography>
                            <Typography>{row.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Role</Typography>
                            <Typography>{CommonFunction.getRoleName(row.roleId)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Counter:</Typography>
                            <Typography>{row.counterName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Status:</Typography>
                            <Label
                                variant={row.status ? 'ghost' : 'filled'}
                                color={row.status ? 'success' : 'error'}
                            >
                                {row.status ? 'Active' : 'Inactive'}
                            </Label>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 },
                }}
            >
                <MenuItem onClick={handleEditOpen}>
                    <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>

            {editOpen && (
                <StaffEditForm
                    open={editOpen}
                    onClose={handleEditClose}
                    staff={row}
                    onSubmit={onSubmit}
                />
            )}

            {deleteOpen && (
                <StaffDeleteForm
                    open={deleteOpen}
                    onClose={handleDeleteClose}
                    onDelete={onDelete}
                    staff={row}
                />
            )}
        </>
    );
}

UserTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.any,
    status: PropTypes.string,
    handleClick: PropTypes.func,
    onReload: PropTypes.func,
};
