import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { Delete as DeleteIcon } from '@mui/icons-material';
import moment from 'moment';
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
    const [discountRate, setDiscountRate] = useState(0);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [customerData, setcustomerData] = useState([]);
    const [staffData, setstaffData] = useState([]);
    const [promotionData, setpromotionData] = useState([]);
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
        setcustomerData(response.data);
    };

    // Lấy dữ liệu nhân viên
    const getuser = async () => {
        try {
            const response = await request.get('User/GetUsers?roleId=3');
            setstaffData(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Lấy dữ liệu khuyến mãi đang có
    const getPromotion = async (customerId = '') => {
        const response = await request.get(
            `Promotion/GetPromotions?available=true&customerId=${customerId}`
        );
        setpromotionData(response.data);
    };

    // Lấy dữ liệu trang sức
    const getjewery = async () => {
        try {
            const response = await request.get('Jewelry/GetJewelries');
            const filteredData = response.data.filter(jewelry => jewelry.type === 1);
            setJewelryData(filteredData);
        } catch (error) {
            console.error("Error fetching jewelry data:", error);
        }
    };
    

    // lấy dữ liệu quầy
    const getCounter = async () => {
        const response = await request.get('Counter/GetCounters');
        setCounterData(response.data);
    };

    useEffect(() => {
        getcustomer();
        getuser();
        getjewery();
        getCounter();
        if (row) {
            setCurrrentFormState('view');
            handleBindingDetail();
        } else {
            getPromotion();
        }
    }, []);

    const handleBindingDetail = async () => {
        if (!row) return;
        try {
            const response = await request.get(`Bill/GetBillById/${row.billId}`);
            const {
                billId,
                customerId,
                userId,
                counterId,
                promotions,
                saleDate,
                totalAmount,
                warranties,
                discountRate: totalDiscountRate,
                discountDescription,
            } = response.data;
            setBillDetail(response.data);
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

            // nếu tồn tại khuyến mãi thì set lại giá trị cho selectedPromotion
            if (discountDescription) {
                setSelectedPromotion({
                    description: discountDescription,
                    discountRate: totalDiscountRate,
                });
                setDiscountRate(totalDiscountRate);
            }
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
        type: 1,
    });

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0 }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);

        setFormState((prevState) => ({
            ...prevState,
            jewelries: updatedItems.map((item) => ({
                jewelryId: item.jewelryId,
                quantity: item.quantity,
            })),
            totalAmount: calculateTotal(),
        }));
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const calculateSubtotal = () => items.reduce((total, item) => total + item.totalAmount || 0, 0);
    const calculateDiscount = () => calculateSubtotal() * ((discountRate || 0) / 100);
    const calculateTotal = () => calculateSubtotal() - calculateDiscount();

    const handleChangeQuantity = (index, newValue) => {
        handleInputChange(index, 'quantity', parseInt(newValue, 10));
        handleInputChange(index, 'totalAmount', caculatetotalAmount(items[index]));

        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            totalAmount: caculatetotalAmount(updatedItems[index]),
        };

        setItems(updatedItems);
    };

    // Hàm tính tổng giá trị sản phẩm
    const caculatetotalAmount = (item) => {
        // totalAmount = [giá vàng thời điểm * trọng lượng sản phẩm] + tiền công + tiền đá
        const totalAmount =
            item.goldSellPrice * item.goldWeight +
            item.laborCost +
            item.gemSellPrice * item.gemQuantity;

        return totalAmount * (item.quantity || 0);
    };

    // Hàm xử lý khi chọn sản phẩm trang sức
    const handleChangeJewelry = (index, newValue) => {
        if (!newValue) {
            const updatedItems = [...items];
            updatedItems[index] = {};
            setItems(updatedItems);
            return;
        }
        console.log('newValue', newValue);

        const { gold, gem } = newValue.materials[0];

        handleInputChange(index, 'jewelryId', newValue.jewelryId);
        handleInputChange(index, 'name', newValue.name);
        handleInputChange(index, 'quantity', 1); // Default quantity

        handleInputChange(index, 'price', newValue.totalAmount);
        handleInputChange(index, 'laborCost', newValue.laborCost);

        handleInputChange(index, 'gemType', gem.gemType);
        handleInputChange(index, 'gemQuantity', gem.gemQuantity);
        handleInputChange(index, 'gemSellPrice', gem.gemPrice);

        handleInputChange(index, 'goldType', gold.goldType);
        handleInputChange(index, 'goldWeight', gold.goldWeight);
        handleInputChange(index, 'goldSellPrice', gold.goldPrice);

        handleInputChange(index, 'totalAmount', caculatetotalAmount(items[index]));
    };

    // Hàm xử lý khi chọn khuyến mãi
    const handleChangePromotion = (event, newValue) => {
        setSelectedPromotion(newValue);
        if (!newValue) {
            setDiscountRate(0);
            setFormState((prevState) => ({
                ...prevState,
                promotions: [],
            }));
            return;
        }
        if (newValue) setDiscountRate(newValue.discountRate);
        setFormState((prevState) => ({
            ...prevState,
            promotions: [{ promotionId: newValue?.promotionId }],
        }));
    };

    // lấy ra danh sách trang sức mà chưa được chọn trong form
    const jewelryDataFilter = jewelryData.filter(
        (jewelry) => !items.some((item) => item.jewelryId === jewelry.jewelryId)
    );

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

        const response = await request.post('Bill/CreateBill', formState);
        if (response.status === 200) {
            toast.success('Create bill success');
            setCurrrentFormState('view');
            const { data } = response.data;
            window.open(data, '_blank');
        } else {
            toast.error('Create bill fail');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>
                <IconButton onClick={onClose}>
                    <Iconify icon="eva:arrow-back-fill" />
                </IconButton>
                <span>{currrentFormState === 'add' ? 'New Sale Bill' : 'Sale Bill Detail'}</span>
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
                                    label="Sale Date"
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
                                    getOptionLabel={(option) =>
                                        `Code: ${option.code} - Name: ${option.fullName}`
                                    }
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
                                    getOptionLabel={(option) =>
                                        `Code: ${option.code} - Name: ${option.fullName}`
                                    }
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
                                        getPromotion(newValue?.customerId);
                                        if (newValue?.customerId) {
                                            setSelectedPromotion(null);
                                            setDiscountRate(0);
                                        }
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
                            Billing Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Table style={{ marginBottom: 16 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={400}>Code</TableCell>
                                            <TableCell width={100}>Qty</TableCell>
                                            <TableCell width={180}>Labor Cost</TableCell>

                                            <TableCell width={140}>Gem Type</TableCell>
                                            <TableCell width={140}>Gem Qty</TableCell>
                                            <TableCell width={140}>Gem Price</TableCell>

                                            <TableCell width={140}>Gold Type</TableCell>
                                            <TableCell width={140}>Gold Weight</TableCell>
                                            <TableCell width={140}>Gold Price</TableCell>

                                            <TableCell>Total</TableCell>
                                            {currrentFormState === 'view' && (
                                                <TableCell>Warranty</TableCell>
                                            )}
                                            {currrentFormState === 'add' && (
                                                <TableCell>Action</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                {currrentFormState === 'view' ? (
                <Typography>
                    {item ? `${item.code} - ${item.name}` : 'No item selected'}
                </Typography>
            ) : (
                                                    <Autocomplete
                                                        size="small"
                                                        options={jewelryDataFilter}
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
                                                        
                                                        
                                                    />
            )}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleChangeQuantity(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                        disabled={currrentFormState === 'view'}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.laborCost}</TableCell>

                                                <TableCell>{item.gemType}</TableCell>
                                                <TableCell>{item.gemQuantity}</TableCell>
                                                <TableCell>{item.gemSellPrice}</TableCell>

                                                <TableCell>{item.goldType}</TableCell>
                                                <TableCell>{item.goldWeight}</TableCell>
                                                <TableCell>{item.goldSellPrice}</TableCell>

                                                <TableCell>{item.totalAmount}</TableCell>
                                                {currrentFormState === 'view' && (
                                                    <TableCell>
                                                        {item.warranty
                                                            ? moment(item.warranty).format(
                                                                  'DD/MM/YYYY'
                                                              )
                                                            : ''}
                                                    </TableCell>
                                                )}
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
                                <Autocomplete
                                    size="small"
                                    options={promotionData}
                                    getOptionLabel={(option) => option.description}
                                    value={selectedPromotion}
                                    onChange={(event, newValue) =>
                                        handleChangePromotion(event, newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            size="small"
                                            {...params}
                                            label="Promotion"
                                            fullWidth
                                        />
                                    )}
                                    style={{ marginBottom: 16 }}
                                    readOnly={currrentFormState === 'view'}
                                />
                                <Divider
                                    style={{
                                        marginTop: 16,
                                    }}
                                />
                                <Typography variant="h6">Summary</Typography>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="subtitle1">Subtotal:</Typography>
                                    <Typography variant="subtitle1">
                                        {calculateSubtotal().toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="subtitle1">Discount:</Typography>
                                    <Typography variant="subtitle1">
                                        {calculateDiscount().toFixed(2)}
                                    </Typography>
                                </Box>
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
            </DialogContent>

            <InvoicePrintTemplate row={billDetail} open={openInvoice} onClose={onCloseInvoice} />
        </Dialog>
    );
};

InvoiceTemplate.propTypes = {
    open: PropTypes.bool.isRequired,
    row: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default InvoiceTemplate;
