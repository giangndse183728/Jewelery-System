import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import axios from 'axios';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import moment from 'moment';

import Iconify from 'src/components/iconify';
import request from 'src/request';
import InvoiceTemplate from './sale-form';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, row, handleClick }) {
    const [open, setOpen] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const [openDetail, setOpenDetail] = useState(false);

    const handleViewDetail = () => {
        setOpenDetail(true);
        handleCloseMenu();
    };

    // convert date to dd/mm/yyyy hh:mm
    const convertDate = (date) => {
        if (!date) return '';
        return moment(date).format('DD/MM/YYYY HH:mm');
    };


    const payNow = async () => {
        const response = await request.get(`Bill/PayNow/${row.billId}`);
        const { data, success, message } = response.data;
        if (success) {
            window.open(data, '_blank');
        } else {
            toast.error(message);
        }
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell>{row.billId}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.staffName}</TableCell>
                <TableCell>{row.discountRate ? `${row.discountRate}%` : ''}</TableCell>
                <TableCell>{row.totalAmount}</TableCell>
                <TableCell>{convertDate(row.saleDate)}</TableCell>
                <TableCell>{row.paymentStatus ? 'Paid' : 'Unpaid'}</TableCell>
                <TableCell align="right">
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
                <MenuItem onClick={handleViewDetail}>
                    <Iconify icon="eva:file-text-fill" color="primary" />
                    Detail
                </MenuItem>

                {!row.paymentStatus && <MenuItem onClick={payNow}>
                    <Iconify icon="eva:credit-card-fill" color="primary" />
                    Pay now
                </MenuItem>}
            </Popover>

            {openDetail && (
                <InvoiceTemplate open={openDetail} row={row} onClose={() => setOpenDetail(false)} />
            )}
        </>
    );
}

UserTableRow.propTypes = {
    row: PropTypes.object,
    handleClick: PropTypes.func,
    selected: PropTypes.any,
};
