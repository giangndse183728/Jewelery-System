import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
    Grid,
    Button,
    Dialog,
    Popover,
    TableRow,
    Checkbox,
    MenuItem,
    TableCell,
    IconButton,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import CommonFunction from 'src/utils/commonFunction';
import GoldpriceEditForm from './goldprice-edit-modal';
import GoldpriceDeleteForm from './goldprice-del-modal';

export default function GoldpriceTableRow({
    selected,
    city,
    buyPrice,
    sellPrice,
    type,
    lastUpdated,
    handleClick,
}) {
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

    const onSubmit = (updatedData) => {
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

    const onDelete = () => {
        handleDeleteClose();
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell>{city}</TableCell>
                <TableCell>{buyPrice}</TableCell>
                <TableCell>{sellPrice}</TableCell>
                <TableCell>{type}</TableCell>
                <TableCell>{new Date(lastUpdated).toLocaleString()}</TableCell>

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
                <DialogTitle>Gold Price Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">City:</Typography>
                            <Typography>{city}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Buy Price:</Typography>
                            <Typography>{buyPrice}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Sell Price:</Typography>
                            <Typography>{sellPrice}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Type:</Typography>
                            <Typography>{type}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Last Updated:</Typography>
                            <Typography>{new Date(lastUpdated).toLocaleString()}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {!CommonFunction.IsStaff() && (
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
            )}

            <GoldpriceEditForm
                open={editOpen}
                onClose={handleEditClose}
                goldprice={{
                    city,
                    buyPrice,
                    sellPrice,
                    type,
                    lastUpdated,
                }}
                onSubmit={onSubmit}
            />

            <GoldpriceDeleteForm
                open={deleteOpen}
                onClose={handleDeleteClose}
                onDelete={onDelete}
                goldprice={{
                    city,
                    buyPrice,
                    sellPrice,
                    type,
                    lastUpdated,
                }}
            />
        </>
    );
}

GoldpriceTableRow.propTypes = {
    city: PropTypes.string.isRequired,
    buyPrice: PropTypes.string.isRequired,
    sellPrice: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    handleClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
};
