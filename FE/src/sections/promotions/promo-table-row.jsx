import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

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

import request from 'src/request';
import PromotionEditForm from './promo-edit-modal';
import PromotionDeleteForm from './promo-del-modal';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, row, handleClick, getPromotion }) {
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
            const res = await request.put(
                `Promotion/UpdatePromotion/${row.promotionId}`,
                updatedData
            );
            if (res.status === 200) {
                toast.success('Edit promotion success');
                getPromotion();
            } else {
                toast.error('Edit promotion fail');
            }
            handleEditClose();
        } catch (e) {
            toast.error('Error response');
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
            const res = await request.delete(`Promotion/DeletePromotion/${row.promotionId}`);
            if (res.status === 200) {
                toast.success('Delete success');
                getPromotion();
            } else {
                toast.error('Delete fail');
            }
            handleDeleteClose();
            // window.location.reload();
        } catch (e) {
            toast.error('error response');
        }
    };

    // convert date to dd/mm/yyyy
    const convertDate = (date) => {
        if (!date) return '';
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell>{row.description}</TableCell>
                {/* <TableCell>{row.type}</TableCell> */}
                <TableCell>{`${row.discountRate}%`}</TableCell>
                <TableCell>{convertDate(row.startDate)}</TableCell>
                <TableCell>{convertDate(row.endDate)}</TableCell>
                {/* <TableCell>{row.approveManager}</TableCell> */}
                <TableCell>
                    {row.customerPromotions?.map((cus) => cus.fullName).join(', ') || ''}
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
                <DialogTitle>Promotion</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Promotion</Typography>
                            <Typography>{row.description}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Type:</Typography>
                            <Typography>{row.type}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">DiscountRate:</Typography>
                            <Typography>{`${row.discountRate}%`}</Typography>
                        </Grid>
                        {/* <Grid item xs={12}>
              <Typography variant="h6">Approval Manager:</Typography>
              <Typography>{row.approveManager}</Typography>
            </Grid> */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Start Date:</Typography>
                            <Typography>{convertDate(row.startDate)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">End Date:</Typography>
                            <Typography>{convertDate(row.endDate)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Customers:</Typography>
                            <Typography>
                                {row.customerPromotions?.map((cus) => cus.fullName).join(', ') ||
                                    ''}
                            </Typography>
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
                <PromotionEditForm
                    open={editOpen}
                    onClose={handleEditClose}
                    promotion={row}
                    onSubmit={onSubmit}
                />
            )}

            {deleteOpen && (
                <PromotionDeleteForm
                    open={deleteOpen}
                    onClose={handleDeleteClose}
                    onDelete={onDelete}
                    promotion={row}
                />
            )}
        </>
    );
}

UserTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.any,
    handleClick: PropTypes.func,
    getPromotion: PropTypes.func,
};
