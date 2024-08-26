import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { toast } from 'react-toastify';
import { Autocomplete } from '@mui/material';
import request from 'src/request';
import moment from 'moment';

function PromotionForm({ open, onClose, onSubmit }) {
    const [customers, setCustomer] = React.useState([]);
    const initialFormState = {
        discountRate: '',
        startDate: '',
        endDate: '',
        approveManager: '',
        description: '',
        customerPromotions: [],
    };

    const [formState, setFormState] = React.useState(initialFormState);
    // const [promotions, setPromotions] = React.useState([]);

    useEffect(() => {
        // const fetchPromotions = async () => {
        //     const response = await request.get('Promotion/GetPromotions');
        //     setPromotions(response.data);
        // };

        // fetchPromotions();
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        const response = await request.get('Customer');
        const data = response.data
            .filter((item) => item.point > 500) // Filter customers with more than 500 points
            .map((item) => ({
                label: item.fullName,
                value: item.customerId,
                point: item.point,
            }));
        setCustomer(data);
    };

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };
    const validate = () => {
        if (!formState.description) {
            toast.error('Description is required');
            return false;
        }
        if (!formState.startDate) {
            toast.error('Start Date is required');
            return false;
        }
        if (!formState.endDate) {
            toast.error('End Date is required');
            return false;
        }
        if (!formState.discountRate) {
            toast.error('Discount Rate is required');
            return false;
        }
        if (formState.discountRate < 0 || formState.discountRate > 100) {
            toast.error('Discount Rate must be between 0 and 100');
            return false;
        }
        return true;
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

        // // Kiểm tra xem startDate và endDate của mã giảm giá mới có trùng với mã giảm giá nào hiện có không
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
        //     toast.error('The new promotion dates overlap with an existing promotion.');
        //     return; // Dừng hàm nếu điều kiện không được thoả mãn
        // }

        if (validate()) {
            onSubmit(formState); // Gọi addPromotion
            setFormState(initialFormState); // Clear các trường của form sau khi submit
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Promotion</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="description"
                    label="Promotion"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <TextField
                    margin="dense"
                    name="startDate"
                    label=""
                    type="date"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <TextField
                    margin="dense"
                    name="endDate"
                    label=""
                    type="date"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <TextField
                    margin="dense"
                    name="discountRate"
                    label="Discount Rate"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                    InputProps={{ style: { marginBottom: 10 } }}
                />
                <Autocomplete
                    multiple
                    id="customerPromotions"
                    options={customers}
                    onChange={(event, value) =>
                        setFormState({
                            ...formState,
                            customerPromotions: value.map((item) => ({
                                customerId: item.value,
                            })),
                        })
                    }
                    renderOption={(props, option) => (
                        <li {...props} key={option.value}>
                            {`${option.label} - ${option.point} point`}
                        </li>
                    )}
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

PromotionForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default PromotionForm;