import { toast } from 'react-toastify';
import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Table,
    Dialog,
    Button,
    TableRow,
    TextField,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    IconButton,
    DialogTitle,
    Autocomplete,
    DialogContent,
    Divider,
    Tooltip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { Delete as DeleteIcon } from '@mui/icons-material';
import request from 'src/request';
import { jwtDecode } from 'jwt-decode';
import CommonFunction from 'src/utils/commonFunction';
import InvoicePrintTemplate from './invoice-print';

const InvoiceTemplate = ({ open, row, onClose }) => {
    const token = localStorage.getItem('TOKEN');
    const decoded = jwtDecode(token);
    const currentUserId = decoded.Id;
    const currentCounterId = decoded.jti;

    const [currentDate, setCurrentDate] = useState(new Date());
    const [items, setItems] = useState([]);
    const [customerData, setcustomerData] = useState([]);
    const [staffData, setstaffData] = useState([]);
    const [jewelryData, setJewelryData] = useState([]);
    const [counterData, setCounterData] = useState([]);
    const [currrentFormState, setCurrrentFormState] = useState('add');
    const [openInvoice, setOpenInvoice] = useState(false);
    const [billDetail, setBillDetail] = useState({});

    const onOpenInvoice = () => {
        setOpenInvoice(true);
    };

    const onCloseInvoice = () => {
        setOpenInvoice(false);
    };

    // Lấy dữ liệu khách hàng
    const getcustomer = async () => {
        const response = await request.get('Customer');
        setcustomerData(response.data || []);
    };

    // Lấy dữ liệu nhân viên
    const getuser = async () => {
        try {
            const response = await request.get('User/GetUsers?roleId=3');
            setstaffData(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Lấy dữ liệu trang sức
    const getjewery = async () => {
        const response = await request.get('Jewelry/GetJewelries');
        setJewelryData(response.data || []);
    };

    // lấy dữ liệu quầy
    const getCounter = async () => {
        const response = await request.get('Counter/GetCounters');
        setCounterData(response.data || []);
    };

    useEffect(() => {
        getcustomer();
        getuser();
        getjewery();
        getCounter();
        if (row) {
            setCurrrentFormState('view');
            handleBindingDetail();
        }
    }, []);

    const handleBindingDetail = async () => {
        if (!row) return;
        try {
            const response = await request.get(`Bill/GetBillById/${row.billId}`);

            const { billId, customerId, userId, counterId, saleDate } = response.data;
            setBillDetail(response.data);
            console.log(response.data)
            setCurrentDate(new Date(saleDate));
            setFormState({
                billId,
                customerId,
                userId,
                counterId,
            });

            // set lại các sản phẩm đã chọn trong bill
            setItems(
                response.data.items.map((item) => ({
                    ...item,
                    gemQuantity: item.stoneQuantity,
                }))
            );
        } catch (error) {
            console.error('Error fetching bill:', error);
        }
    };

    const [formState, setFormState] = useState({
        customerId: null,
        userId: CommonFunction.IsStaff() ? parseFloat(currentUserId) : null,
        counterId: CommonFunction.IsStaff() ? parseFloat(currentCounterId) : null,
        jewelries: [],
        promotions: [],
        totalAmount: 0,
        type: 2,
    });

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0, totalAmount: 0 }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        // nếu field là những trường cần tính toán thì cập nhật lại giá trị totalAmount
        if (
            ['quantity', 'goldWeight', 'gemQuantity', 'gemSellPrice', 'goldSellPrice'].includes(
                field
            )
        ) {
            updatedItems[index][field] = parseFloat(value, 10);
            updatedItems[index].totalAmount = caculatetotalAmount(updatedItems[index]);
        }
        setItems(updatedItems);

        setFormState((prevState) => ({
            ...prevState,
            jewelries: updatedItems.map((item) => ({
                jewelryId: item.jewelryId,
                quantity: item.quantity,
                gemQuantity: item.gemQuantity,
                goldWeight: item.goldWeight,
                gemSellPrice: item.gemSellPrice,
                goldSellPrice: item.goldSellPrice,
            })),
            totalAmount: calculateTotal(),
        }));
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const calculateTotal = () => items.reduce((total, item) => total + item.totalAmount, 0);

    const isNaN = (value) => (Number.isNaN(value) ? 0 : value);

    // Hàm tính tổng giá trị sản phẩm khi mua lại của khách hàng
    const caculatetotalAmount = (item) => {
        // totalAmount = phần vàng thực tế * giá vàng mua vào theo bảng giá thời điểm + (tiền đá * số lượng đá) * 70%
        const goldAmount = isNaN(item.goldWeight * item.goldSellPrice);
        const gemAmount = isNaN(item.gemQuantity * item.gemSellPrice * 0.7);

        const totalAmount = (goldAmount + gemAmount) * item.quantity;

        return totalAmount;
    };

    // Hàm xử lý khi chọn sản phẩm trang sức
    const handleChangeJewelry = (index, newValue) => {
        if (!newValue) {
            const updatedItems = [...items];
            updatedItems[index] = {};
            setItems(updatedItems);
            return;
        }
        const { gold, gem } = newValue.materials[0];

        handleInputChange(index, 'jewelryId', newValue.jewelryId);
        handleInputChange(index, 'name', newValue.name);
        handleInputChange(index, 'quantity', 1); // Default quantity

        handleInputChange(index, 'gemType', gem.gemType);
        handleInputChange(index, 'gemQuantity', gem.gemQuantity);
        handleInputChange(index, 'gemSellPrice', gem.gemPrice);

        handleInputChange(index, 'goldType', gold.goldType);
        handleInputChange(index, 'goldWeight', gold.goldWeight);
        handleInputChange(index, 'goldSellPrice', gold.goldPrice);

        handleInputChange(index, 'totalAmount', caculatetotalAmount(items[index]));
    };

    // Hàm xử lý lưu hóa đơn
    const handleSave = async () => {
        if (!formState.counterId) {
            toast.error('Please select counter');
            return;
        }

        if (!formState.userId) {
            toast.error('Please select staff');
            return;
        }

        if (!formState.customerId) {
            toast.error('Please select customer');
            return;
        }

        if (!items.length) {
            toast.error('Please add at least one item');
            return;
        }

        if (!items.every((item) => item.jewelryId)) {
            toast.error('Please select all items');
            return;
        }

        if (!items.every((item) => item.quantity || item.quantity <= 0)) {
            toast.error('Quantity must be greater than 0');
            return;
        }

        if (!items.every((item) => item.quantity > 0)) {
            toast.error('Quantity must be greater than 0');
            return;
        }

        try {
            const response = await request.post('Bill/CreateBill', formState);
            if (response.status === 200) {
                toast.success('Create purchase bill successfully');
                setCurrrentFormState('view');
                setBillDetail({
                    ...formState,
                    items,
                    
                });
                console.log(formState);
                
            } else {
                toast.error('Create purchase bill failed');
            }
        } catch (error) {
            console.error('Error creating purchase bill:', error);
            toast.error('Error creating purchase bill');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>
                <IconButton onClick={onClose}>
                    <Iconify icon="eva:arrow-back-fill" />
                </IconButton>
                <span>
                    {currrentFormState === 'add' ? 'Purchase Bill' : 'Purchase Bill Details'}
                </span>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" style={{ marginBottom: 16 }}>
                            {/* <IconButton onClick={onClose}>
                                <Iconify icon="eva:arrow-ios-back-fill" />
                            </IconButton> */}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <TextField
                                    size="small"
                                    label="Purchase Date"
                                    type="date"
                                    value={currentDate.toISOString().slice(0, 10)}
                                    onChange={(e) => setCurrentDate(new Date(e.target.value))}
                                    fullWidth
                                    disabled
                                    style={{ marginBottom: 16 }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Autocomplete
                                    size="small"
                                    options={counterData}
                                    getOptionLabel={(option) => `${option.name}`}
                                    value={
                                        counterData.find(
                                            (option) => option.counterId === formState.counterId
                                        ) || null
                                    }
                                    onChange={(event, newValue) => {
                                        setFormState((prevState) => ({
                                            ...prevState,
                                            counterId: newValue?.counterId,
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Counter Name" fullWidth />
                                    )}
                                    style={{ marginBottom: 16 }}
                                    readOnly={currrentFormState === 'view'}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    size="small"
                                    options={staffData}
                                    value={
                                        staffData.find(
                                            (option) => option.userId === formState.userId
                                        ) || null
                                    }
                                    getOptionLabel={(option) => `${option.code} ${option.fullName}`}
                                    onChange={(event, newValue) => {
                                        setFormState((prevState) => ({
                                            ...prevState,
                                            userId: newValue?.userId,
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Staff Name" fullWidth />
                                    )}
                                    style={{ marginBottom: 16 }}
                                    readOnly={currrentFormState === 'view'}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    size="small"
                                    options={customerData}
                                    getOptionLabel={(option) => `${option.code} ${option.fullName}`}
                                    value={
                                        customerData.find(
                                            (option) => option.customerId === formState.customerId
                                        ) || null
                                    }
                                    onChange={(event, newValue) => {
                                        setFormState((prevState) => ({
                                            ...prevState,
                                            customerId: newValue?.customerId,
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Customer Name" fullWidth />
                                    )}
                                    style={{ marginBottom: 16 }}
                                    readOnly={currrentFormState === 'view'}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ marginBottom: 16 }}>
                            Purchase Items
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Table style={{ marginBottom: 16 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={400}>Code</TableCell>
                                            <TableCell width={100}>Qty</TableCell>

                                            <TableCell width={140}>Gem Type</TableCell>
                                            <TableCell width={140}>Gem Qty</TableCell>
                                            <TableCell width={140}>Gem Price</TableCell>

                                            <TableCell width={140}>Gold Type</TableCell>
                                            <TableCell width={140}>Gold Weight</TableCell>
                                            <TableCell width={140}>Gold Price</TableCell>

                                            <Tooltip
                                                describeChild
                                                title="Total = (Gold Weight * Gold Price) + (Gem Quantity * Gem Price * 70%) * Quantity"
                                            >
                                                <TableCell>Total</TableCell>
                                            </Tooltip>
                                            {currrentFormState === 'add' && (
                                                <TableCell>Action</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Autocomplete
                                                        size="small"
                                                        options={jewelryData}
                                                        value={
                                                            jewelryData.find(
                                                                (option) =>
                                                                    option.jewelryId ===
                                                                    item.jewelryId
                                                            ) || null
                                                        }
                                                        getOptionLabel={(option) =>
                                                            `${option.code} - ${option.name}`
                                                        }
                                                        onChange={(event, newValue) => {
                                                            handleChangeJewelry(index, newValue);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                size="small"
                                                                {...params}
                                                                label="Select Item"
                                                                fullWidth
                                                            />
                                                        )}
                                                        readOnly={currrentFormState === 'view'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                'quantity',
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                        disabled={currrentFormState === 'view'}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.gemType}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={item.gemQuantity}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                'gemQuantity',
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                        disabled={currrentFormState === 'view'}
                                                    />
                                                </TableCell>
                                                {/* <TableCell>{item.gemSellPrice}</TableCell> */}
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={item.gemSellPrice}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                'gemSellPrice',
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                        disabled={currrentFormState === 'view'}
                                                    />
                                                </TableCell>

                                                <TableCell>{item.goldType}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={item.goldWeight}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                'goldWeight',
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                        disabled={currrentFormState === 'view'}
                                                    />
                                                </TableCell>
                                                {/* <TableCell>{item.goldSellPrice}</TableCell> */}
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={item.goldSellPrice}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                'goldSellPrice',
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                        disabled={currrentFormState === 'view'}
                                                    />
                                                </TableCell>

                                                <TableCell>{item.totalAmount}</TableCell>
                                                {currrentFormState === 'add' && (
                                                    <TableCell>
                                                        <IconButton
                                                            onClick={() => handleDeleteItem(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {currrentFormState === 'add' && (
                                    <Button onClick={handleAddItem} style={{ marginBottom: 16 }}>
                                        Add Item
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={8} />
                            <Grid item xs={4}>
                                <Typography variant="h6">Summary</Typography>
                                <Divider
                                    style={{
                                        marginTop: 16,
                                    }}
                                />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6">
                                        {calculateTotal().toFixed(2)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {currrentFormState === 'add' && (
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={onClose} color="primary" style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </Box>
                )}
                {row && (
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={onOpenInvoice} color="primary" style={{ marginRight: 8 }}>
                            Print Invoice
                        </Button>
                    </Box>
                )}
                <InvoicePrintTemplate
                    row={billDetail}
                    open={openInvoice}
                    onClose={onCloseInvoice}
                />
            </DialogContent>
        </Dialog>
    );
};

InvoiceTemplate.propTypes = {
    open: PropTypes.bool.isRequired,
    row: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default InvoiceTemplate;
