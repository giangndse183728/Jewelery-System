import React from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    Box,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import moment from 'moment';
import './invoice-print.css';

const InvoicePrintTemplate = ({ row, open, onClose }) => {
    const calculateSubtotal = () =>
        row?.items?.reduce((total, item) => total + (item.totalAmount || 0), 0);
    const calculateDiscount = () => calculateSubtotal() * ((row.discountRate || 0) / 100);
    const calculateTotal = () => calculateSubtotal() - calculateDiscount();

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle className="noPrint">
                <IconButton onClick={onClose}>
                    <Iconify icon="eva:arrow-back-fill" />
                </IconButton>
                <span>Preview Purchase Invoice</span>
            </DialogTitle>
            <DialogContent>
                <Box p={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h4" gutterBottom>
                                Invoice Number: {row.billId}
                            </Typography>
                            <Typography variant="subtitle1">Invoice Date:</Typography>
                            <Typography variant="body1">
                                {moment(row.saleDate).format('DD-MM-YYYY')}
                            </Typography>
                            <Divider sx={{ marginY: 2, mt: 1 }} />
                        </Grid>
                        <Grid item xs={6}>
                            <Box textAlign="right">
                                <img src="/assets/logo.svg" alt="" style={{ width: 90 }} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5">Customer:</Typography>
                            <Typography variant="body1">Code: {row.customerCode}</Typography>
                            <Typography variant="body1">Name: {row.customerName}</Typography>
                            <Typography variant="body1">Address: {row.customerAddress}</Typography>
                            <Typography variant="body1">Phone: {row.customerPhone}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="h5">Sales Person:</Typography>
                            <Typography variant="body1">Code: {row.staffCode}</Typography>
                            <Typography variant="body1">Name: {row.staffName}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginY: 2, mt: 1 }} />
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Gem Type</TableCell>
                                        <TableCell>Gem Qty</TableCell>
                                        <TableCell>Gem Price</TableCell>
                                        <TableCell>Gold Type</TableCell>
                                        <TableCell>Gold Weight</TableCell>
                                        <TableCell>Gold Price</TableCell>
                                        <TableCell>Total Amount</TableCell>
                                        <TableCell>Warranty</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.items?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {item.code} - {item.name}
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.gemType}</TableCell>
                                            <TableCell>{item.stoneQuantity}</TableCell>
                                            <TableCell>{item.gemSellPrice} VNĐ</TableCell>
                                            <TableCell>{item.goldType}</TableCell>
                                            <TableCell>{item.goldWeight}</TableCell>
                                            <TableCell>{item.goldSellPrice} VNĐ</TableCell>
                                            <TableCell>{item.totalAmount} VNĐ</TableCell>
                                            <TableCell>
                                                {item.warranty
                                                    ? moment(item.warranty).format('DD-MM-YYYY')
                                                    : ''}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={7} />
                        <Grid item xs={5}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="subtitle1">Subtotal:</Typography>
                                <Typography variant="subtitle1">
                                    {calculateSubtotal()?.toFixed(2)} VNĐ
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="subtitle1">Discount:</Typography>
                                <Typography variant="subtitle1">
                                    {calculateDiscount()?.toFixed(2)} VNĐ
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">
                                    {calculateTotal()?.toFixed(2)} VNĐ
                                </Typography>
                            </Box>

                            <Box mt={4} className="noPrint">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => {
                                        window.print();
                                    }}
                                >
                                    Print
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginY: 2, mt: 5 }} />
                    <Box mt={3} >
                        <Typography variant="h6">Policy:</Typography>
                        <Typography variant="body2">
                            - Goods once sold are not eligible for exchange or return..
                        </Typography>
                        <Typography variant="body2">
                            - Please keep the invoice for any future reference.
                        </Typography>
                        <Typography variant="body2">
                            - For any inquiries, contact our customer service at (123) 456-7890.
                        </Typography>
                    </Box>
                    <Box mt={6}>
                        <Typography variant="h6">Authorized Signature: _____________</Typography>
                        <Box mt={5} width="50%">
                            <Divider />
                        </Box>
                        <Box textAlign="center" sx={{ marginTop: 5 }}>
                            <Typography variant="h4">THANK YOU!</Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

InvoicePrintTemplate.propTypes = {
    row: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InvoicePrintTemplate;
