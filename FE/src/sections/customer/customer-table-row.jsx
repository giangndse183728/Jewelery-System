import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Iconify from 'src/components/iconify';

import axios from 'axios';
import request from 'src/request';
import CustomerDeleteForm from './customer-del-model';
import CustomerEditForm from './customer-edit-model';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, row, handleClick, getCustomer }) {
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
        const res = await request.put(`Customer/UpdateCustomer/${row.customerId}`, updatedData);
        if (res.status === 200) {
            toast.success('Update customer successfully');
            handleEditClose();
            getCustomer(); // Cập nhật danh sách khách hàng sau khi cập nhật thành công
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
        const res = await request.delete(`Customer/DeleteCustomer/${row.customerId}`);
        if (res.status === 200) {
            toast.success('Delete customer successfully');
            getCustomer(); // Cập nhật danh sách khách hàng sau khi xóa thành công
        } else {
            toast.error('Delete customer failed');
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
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.point}</TableCell>
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
                <DialogTitle>Customer</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Code:</Typography>
                            <Typography>{row.code}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Name:</Typography>
                            <Typography>{row.fullName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Address:</Typography>
                            <Typography>{row.address}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Phone Number:</Typography>
                            <Typography>{row.phone}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Point:</Typography>
                            <Typography>{row.point}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Gender:</Typography>
                            <Typography>{row.gender}</Typography>
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

            <CustomerEditForm
                open={editOpen}
                onClose={handleEditClose}
                customer={row}
                onSubmit={onSubmit}
            />

            <CustomerDeleteForm
                open={deleteOpen}
                onClose={handleDeleteClose}
                onDelete={onDelete}
                customer={row}
            />
        </>
    );
}

// UserTableRow.propTypes = {
//   row: PropTypes.object,
//   selected: PropTypes.any,
//   handleClick: PropTypes.func,
//   getCustomer: PropTypes.func,
// };

UserTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.any,
    handleClick: PropTypes.func,
    getCustomer: PropTypes.func,
};
