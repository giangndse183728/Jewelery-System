import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
// eslint-disable-next-line import/no-extraneous-dependencies
import Barcode from 'react-barcode';
import './jew-modal.css';
import { toast } from 'react-toastify';
import request from 'src/request';
import CommonFunction from 'src/utils/commonFunction';

export default function NewModal({ show, handleClose, createJew }) {
    const [goldtype, setGoldtype] = useState([]);
    const [gemtype, setGemtype] = useState([]);
    const [jewelleryType, setJewelleryType] = useState([]);
    const [imageName, setImageName] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [counters, setCounters] = useState([]);

    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i += 1) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const formik = useFormik({
        initialValues: {
            jewelryTypeId: null,
            name: '',
            code: generateRandomString(4),
            jewelryMaterial: {
                gemId: null,
                goldId: null,
                goldWeight: 0,
                gemQuantity: 0,
            },
            barcode: generateRandomString(7),
            laborCost: null,
            warrantyTime: null,
            jewelryCounters: [],
            type: 1,
        },
        onSubmit: async (values) => {
            values.previewImage = imageName;
            // Chuyển đổi warrantyTime thành số nguyên nếu có giá trị, hoặc giữ nguyên null
            values.warrantyTime = values.warrantyTime ? parseInt(values.warrantyTime, 10) : null;
            const res = await createJew(values);
            if (res && res.status === 200) {
                toast.success('Jewellery added successfully');
                formik.resetForm();
                handleClose();
            }
        },
        validate: (values) => {
            const errors = {};
            const validateFields = [
                'name',
                'code',
                'laborCost',
                'barcode',
                'jewelryTypeId',
                'warrantyTime',
            ];
            validateFields.forEach((field) => {
                if (!values[field]) {
                    errors[field] = 'Required';
                }
            });

            if (values.laborCost && Number(values.laborCost) < 0) {
                errors.laborCost = 'Must be greater than or equal to 0';
            }
            if (values.warrantyTime && Number(values.warrantyTime) < 0) {
                errors.warrantyTime = 'Must be greater than or equal to 0';
            }
            if (!values.jewelryTypeId) {
                errors.jewelryTypeId = 'Please select a jewelry type';
            }

            // if (!values.jewelryMaterial || !values.jewelryMaterial.gemId) {
            //     errors.jewelryMaterial = errors.jewelryMaterial || {};
            //     errors.jewelryMaterial.gemId = 'Please select a gem type';
            // }
            // if (!values.jewelryMaterial || !values.jewelryMaterial.goldId) {
            //     errors.jewelryMaterial = errors.jewelryMaterial || {};
            //     errors.jewelryMaterial.goldId = 'Please select a gold type';
            // }
            return errors;
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getGemPrices(),
                    getGoldPrices(),
                    getJewelleryTypes(),
                    fetchCounters(),
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const getGoldPrices = async () => {
        try {
            const response = await request.get('Price/GetGoldPrices');
            const goldOptions = response.data.map((item) => ({
                label: item.type,
                value: item.goldId,
            }));
            setGoldtype(goldOptions);
        } catch (error) {
            console.error('Error fetching gold prices:', error);
        }
    };

    const getGemPrices = async () => {
        try {
            const response = await request.get('Price/GetGemPrices');
            const gemOptions = response.data.map((item) => ({
                label: item.type,
                value: item.gemId,
            }));
            setGemtype(gemOptions);
        } catch (error) {
            console.error('Error fetching gem prices:', error);
        }
    };

    const getJewelleryTypes = async () => {
        try {
            const response = await request.get('JewelryType/GetJewelryTypes');
            const jewelryOptions = response.data.map((item) => ({
                label: item.name,
                value: item.jewelryTypeId,
            }));
            setJewelleryType(jewelryOptions);
        } catch (error) {
            console.error('Error fetching jewellery types:', error);
        }
    };

    const fetchCounters = async () => {
        const response = await request.get('Counter/GetCounters');
        const data = response.data;
        const res = data.map((item) => ({ label: item.name, value: item.counterId }));
        setCounters(res);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('files', file);
            formData.append('type', 0);
            try {
                const response = await request.post('File', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.data && response.data.data.length > 0) {
                    const fileName = response.data.data[0];
                    setImageName(fileName);
                }

                // Generate a preview URL
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    // Replace non-ASCII characters from the barcode
    const handleBarcodeChange = (event) => {
        // eslint-disable-next-line no-control-regex
        const value = event.target.value.replace(/[^\x00-\x7F]/g, '');
        formik.setFieldValue('barcode', value);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Jewellery</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        {/* Left Column */}
                        <Col md={6}>
                            {/* Upload Image */}
                            <InputGroup className="mb-4 mt-3">
                                <FormControl fullWidth>
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control type="file" onChange={handleImageUpload} />
                                    {imagePreviewUrl && (
                                        <img
                                            src={imagePreviewUrl}
                                            alt="Preview"
                                            style={{ marginTop: '10px', maxWidth: '300px' }}
                                        />
                                    )}
                                </FormControl>
                            </InputGroup>
                        </Col>
                        {/* Right Column */}
                        <Col md={6}>
                            {/* Barcode */}
                            <Col md={6}>
                                {formik.values.barcode && (
                                    <div>
                                        <Barcode value={formik.values.barcode} height={30} />
                                    </div>
                                )}
                                <InputGroup className="mb-4 mt-3">
                                    <FormControl fullWidth>
                                        <TextField
                                            disabled
                                            label="Barcode"
                                            name="barcode"
                                            value={formik.values.barcode}
                                            onChange={handleBarcodeChange}
                                            onBlur={formik.handleBlur}
                                            sx={{ width: 300 }}
                                        />
                                    </FormControl>
                                </InputGroup>
                            </Col>
                            {/* Jewellery Code */}
                            <InputGroup className="mb-4 mt-3">
                                <TextField
                                    disabled
                                    label="Jewellery Code"
                                    variant="outlined"
                                    name="code"
                                    value={formik.values.code}
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                />
                            </InputGroup>
                            {/* Jewellery Name */}
                            <InputGroup className="mb-4 mt-3">
                                <TextField
                                    label="Jewellery Name"
                                    variant="outlined"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    sx={{ width: 300 }}
                                />
                            </InputGroup>
                            {/* Labor Cost */}
                            <InputGroup className="mb-4 mt-3">
                                <FormControl fullWidth>
                                    <TextField
                                        label="Labor Cost"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        }}
                                        name="laborCost"
                                        value={formik.values.laborCost}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        error={
                                            formik.touched.laborCost &&
                                            Boolean(formik.errors.laborCost)
                                        }
                                        helperText={
                                            formik.touched.laborCost && formik.errors.laborCost
                                        }
                                        sx={{ width: 300 }}
                                    />
                                    <TextField
                                        className="mt-4"
                                        label="Warranty Time"
                                        name="warrantyTime"
                                        value={formik.values.warrantyTime}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="number"
                                        error={
                                            formik.touched.warrantyTime &&
                                            Boolean(formik.errors.warrantyTime)
                                        }
                                        helperText={
                                            formik.touched.warrantyTime &&
                                            formik.errors.warrantyTime
                                        }
                                        sx={{ width: 300 }}
                                    />
                                </FormControl>
                            </InputGroup>
                        </Col>
                        {/* Gold Material */}
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <Form.Label>
                                    Gold Weight: {formik.values.jewelryMaterial.goldWeight} grams
                                </Form.Label>
                                <Form.Range
                                    className="custom-range"
                                    name="jewelryMaterial.goldWeight"
                                    min={0}
                                    max={2000}
                                    step={1}
                                    value={formik.values.jewelryMaterial.goldWeight}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ width: '100%' }}
                                />
                            </InputGroup>
                            <Autocomplete
                                disablePortal
                                id="goldtype-autocomplete"
                                options={goldtype}
                                onChange={(event, value) =>
                                    formik.setFieldValue(
                                        'jewelryMaterial.goldId',
                                        value ? value.value : ''
                                    )
                                }
                                value={
                                    goldtype.find(
                                        (option) =>
                                            option.value === formik.values.jewelryMaterial.goldId
                                    ) || null
                                }
                                onBlur={formik.handleBlur}
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Gold Type"
                                        error={
                                            formik.touched.jewelryMaterial?.goldId &&
                                            Boolean(formik.errors.jewelryMaterial?.goldId)
                                        }
                                        helperText={
                                            formik.touched.jewelryMaterial?.goldId &&
                                            formik.errors.jewelryMaterial?.goldId
                                        }
                                    />
                                )}
                            />
                        </Col>
                        {/* Gem Material */}
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <Form.Label>
                                    Gem Weight: {formik.values.jewelryMaterial.gemQuantity} grams
                                </Form.Label>
                                <Form.Range
                                    className="custom-range"
                                    name="jewelryMaterial.gemQuantity"
                                    min={0}
                                    max={2000}
                                    step={1}
                                    value={formik.values.jewelryMaterial.gemQuantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{ width: '100%' }}
                                />
                            </InputGroup>
                            <Autocomplete
                                disablePortal
                                id="gemtype-autocomplete"
                                options={gemtype}
                                onChange={(event, value) =>
                                    formik.setFieldValue(
                                        'jewelryMaterial.gemId',
                                        value ? value.value : ''
                                    )
                                }
                                value={
                                    gemtype.find(
                                        (option) =>
                                            option.value === formik.values.jewelryMaterial.gemId
                                    ) || null
                                }
                                onBlur={formik.handleBlur}
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Gem Type"
                                        error={
                                            formik.touched.jewelryMaterial?.gemId &&
                                            Boolean(formik.errors.jewelryMaterial?.gemId)
                                        }
                                        helperText={
                                            formik.touched.jewelryMaterial?.gemId &&
                                            formik.errors.jewelryMaterial?.gemId
                                        }
                                    />
                                )}
                            />
                        </Col>
                        {/* Jewellery Type */}
                        <Col md={6} className="mb-4 mt-3">
                            <Autocomplete
                                disablePortal
                                id="jewellerytype-autocomplete"
                                options={jewelleryType}
                                onChange={(event, value) =>
                                    formik.setFieldValue('jewelryTypeId', value ? value.value : '')
                                }
                                value={
                                    jewelleryType.find(
                                        (option) => option.value === formik.values.jewelryTypeId
                                    ) || null
                                }
                                onBlur={formik.handleBlur}
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Jewellery Type"
                                        error={
                                            formik.touched.jewelryTypeId &&
                                            Boolean(formik.errors.jewelryTypeId)
                                        }
                                        helperText={
                                            formik.touched.jewelryTypeId &&
                                            formik.errors.jewelryTypeId
                                        }
                                    />
                                )}
                            />
                        </Col>

                        {/* Counters */}
                        {!CommonFunction.IsStaff() && (
                            <Col md={6} className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="counter-autocomplete"
                                    options={counters}
                                    multiple
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryCounters',
                                            value.map((item) => ({ counterId: item.value }))
                                        )
                                    }
                                    // value={counters.filter((option) =>
                                    //     formik.values.jewelryCounters.includes(option.value)
                                    // )}
                                    value={formik.values.jewelryCounters.map((counter) =>
                                        counters.find((item) => item.value === counter.counterId)
                                    )}
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Counters" />
                                    )}
                                />
                            </Col>
                        )}
                    </Row>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

NewModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    createJew: PropTypes.func.isRequired,
};
