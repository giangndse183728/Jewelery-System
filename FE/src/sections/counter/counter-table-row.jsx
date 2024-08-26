import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import {
    Grid,
    Button,
    Dialog,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// import router
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify';
import request from 'src/request';
import CounterEditForm from './counter-edit-modal';
import CounterDeleteForm from './counter-del-modal';
// ----------------------------------------------------------------------

export default function CounterTableRow({ selected, handleClick, row, onReload }) {
    const [open, setOpen] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
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
            await request.put(`Counter/UpdateCounter/${row.counterId}`, updatedData);
            onReload();
            toast.success('Counter updated successfully');
        } catch (error) {
            toast.error(error.message);
        }
        handleEditClose();
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
            const response = await request.delete(`Counter/${row.counterId}`);
            const { data } = response;
            if (data.success) {
                toast.success(data.message);
                onReload();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            handleDeleteClose();
        }
    };

    const handleRedirectToStaff = () => {
        handleCloseMenu();
        navigate(`/staff/counter/${row.counterId}`);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell>{row.name}</TableCell>
                <TableCell>{row.numOfStaff}</TableCell>

                <TableCell align="right">
                    <Button variant="outlined" onClick={handleRedirectToStaff}>
                        View Staff List
                    </Button>
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

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
                    <Iconify icon="eva:edit-2-outline" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>

            {editOpen && (
                <CounterEditForm
                    open={editOpen}
                    onClose={handleEditClose}
                    counter={row}
                    onSubmit={onSubmit}
                />
            )}

            {deleteOpen && (
                <CounterDeleteForm
                    open={deleteOpen}
                    onClose={handleDeleteClose}
                    onDelete={onDelete}
                    counter={row}
                />
            )}
        </>
    );
}

CounterTableRow.propTypes = {
    handleClick: PropTypes.func,
    selected: PropTypes.any,
    row: PropTypes.object.isRequired,
    onReload: PropTypes.func,
};
