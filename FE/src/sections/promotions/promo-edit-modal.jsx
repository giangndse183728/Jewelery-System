import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import request from 'src/request';
import { Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import moment from 'moment';

function PromotionEditForm({ open, onClose, onSubmit, promotion }) {
    const [customers, setCustomer] = React.useState([]);
    const [formState, setFormState] = React.useState({
        ...promotion,
        startDate: promotion.startDate ? moment(promotion.startDate).format('YYYY-MM-DD') : '',
        endDate: promotion.endDate ? moment(promotion.endDate).format('YYYY-MM-DD') : '',
        customerPromotions: promotion.customerPromotions || [],
    });

    React.useEffect(() => {
        if (promotion) {
            setFormState({
                ...promotion,
                startDate: promotion.startDate ? moment(promotion.startDate).format('YYYY-MM-DD') : '',
                endDate: promotion.endDate ? moment(promotion.endDate).format('YYYY-MM-DD') : '',
            });
        }
    }, [promotion]);

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        const response = await request.get('Customer');
        const data = response.data.map((item) => ({
            label: item.fullName,
            value: item.customerId,
        }));
        setCustomer(data);
    };

    const handleChange = (event) => {
        setFormState({ ...formState, [event.target.name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn hành động submit mặc định của form

        // Chuyển startDate và endDate sang đối tượng Date
        const startDateObj = new Date(formState.startDate);
        const endDateObj = new Date(formState.endDate);
        const currentDate = new Date();

        // Đặt giờ, phút, giây, và mili giây về 0 để chỉ so sánh ngày
        currentDate.setHours(0, 0, 0, 0);

        // Kiểm tra điều kiện
        if (startDateObj < currentDate || endDateObj < currentDate) {
            toast.error('Start date and end date cannot be in the past.');
            return; // Dừng hàm nếu điều kiện không được thoả mãn
        }

        // Kiểm tra xem startDate và endDate của mã giảm giá mới có trùng với mã giảm giá nào hiện có không
        // const isOverlapping = promotions.some((promo) => {
        //     const existingStartDate = new Date(promo.startDate);
        //     const existingEndDate = new Date(promo.endDate);

        //     return (
        //         (startDateObj >= existingStartDate && startDateObj <= existingEndDate) ||
        //         (endDateObj >= existingStartDate && endDateObj <= existingEndDate) ||
        //         (startDateObj <= existingStartDate && endDateObj >= existingEndDate)
        //     );
        // });

        // if (isOverlapping) {
        //     alert('The new promotion dates overlap with an existing promotion.');
        //     return; // Dừng hàm nếu điều kiện không được thoả mãn
        // }

        onSubmit(formState); // Gọi addPromotion
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Promotion</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="description"
                    label="Promotion"
                    value={formState.description}
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <TextField
                    margin="dense"
                    name="startDate"
                    label="Start Date"
                    value={formState.startDate}
                    type="date"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <TextField
                    margin="dense"
                    name="endDate"
                    value={formState.endDate}
                    label="End Date"
                    type="date"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <TextField
                    margin="dense"
                    name="discountRate"
                    label="Discount Rate"
                    value={formState.discountRate}
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />

                <Autocomplete
                    multiple
                    id="customerPromotions"
                    options={customers}
                    value={formState.customerPromotions.map(
                        (customer) =>
                            customers?.find((item) => item.value === customer.customerId) || {
                                label: customer.fullName,
                                value: customer.customerId,
                            }
                    )}
                    onChange={(event, value) =>
                        setFormState({
                            ...formState,
                            customerPromotions: value.map((item) => ({
                                customerId: item.value,
                                fullName: item.label,
                            })),
                        })
                    }
                    renderInput={(params) => <TextField {...params} label="Customers" />}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

PromotionEditForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    promotion: PropTypes.shape({
        promotionId: PropTypes.any,
        type: PropTypes.string,
        discountRate: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        approveManager: PropTypes.string,
        description: PropTypes.string,
        customerPromotions: PropTypes.arrayOf(PropTypes.any),
    }),
};

export default PromotionEditForm;