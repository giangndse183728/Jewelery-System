import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import { Autocomplete, Switch, FormControlLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Barcode from 'react-barcode';
import request from 'src/request';
import { toast } from 'react-toastify';
import CommonFunction from 'src/utils/commonFunction';

export default function EditModal({ show, handleClose, onUpdate, row }) {
    const [goldtype, setGoldtype] = useState([]);
    const [gemtype, setGemtype] = useState([]);
    const [jewelryTypes, setJewelryTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [counters, setCounters] = useState([]);

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getGoldPrices = async () => {
        try {
            const response = await request.get('Price/GetGoldPrices');
            const types = response.data.map((item) => ({ label: item.type, value: item.goldId }));
            setGoldtype(types);
        } catch (error) {
            console.error('Error fetching gold prices:', error);
        }
    };

    const getGemPrices = async () => {
        try {
            const response = await request.get('Price/GetGemPrices');
            const types = response.data.map((item) => ({ label: item.type, value: item.gemId }));
            setGemtype(types);
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
            setJewelryTypes(jewelryOptions);
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

    const formik = useFormik({
        initialValues: {
            jewelryTypeId: row.jewelryTypeId,
            name: row.name,
            code: row.code,
            jewelryMaterial: {
                gemId: row.materials[0]?.gem.gemId,
                goldId: row.materials[0]?.gold.goldId,
                goldWeight: row.materials[0]?.gold.goldWeight,
                gemQuantity: row.materials[0]?.gem.gemQuantity,
                jewelryMaterialId: row.materials[0]?.jewelryMaterialId,
            },
            warrantyTime: row.warrantyTime || '',
            barcode: row.barcode,
            laborCost: row.laborCost,
            previewImage: row.previewImage,
            jewelryCounters: row.jewelryCounters || [],
            type: row.type,
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

            return errors;
        },
        onSubmit: async (values) => {
            const payload = {
                ...values,
                warrantyTime: values.warrantyTime ? parseInt(values.warrantyTime, 10) : null,
            };

            if (!payload.barcode) {
                toast.error('Barcode is required');
                return;
            }

            if (!payload.name) {
                toast.error('Name is required');
                return;
            }

            if (!payload.code) {
                toast.error('Code is required');
                return;
            }

            await onUpdate(row.jewelryId, payload);
            handleClose();
        },
    });

    const previewImg = useMemo(
        () =>
            `http://localhost:5188/api/File/image/${formik.values.previewImage}?type=${
                formik.values.previewImage !== row.previewImage ? 0 : 1
            }`,
        [formik.values.previewImage, row.previewImage]
    );

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
                    formik.setFieldValue('previewImage', fileName);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleTypeChange = () => {
        formik.setFieldValue('type', formik.values.type === 1 ? 2 : 1);
    };

    if (isLoading) {
        return (
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Loading...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Spinner animation="border" />
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update New Jewellery</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <FormControl fullWidth>
                                    <Form.Label>Upload Image : </Form.Label>
                                    <Form.Control type="file" onChange={handleImageUpload} />
                                    {formik.values.previewImage && (
                                        <img
                                            src={previewImg}
                                            alt="Preview"
                                            style={{ marginTop: '10px', maxWidth: '300px' }}
                                        />
                                    )}
                                </FormControl>
                            </InputGroup>
                            <Col md={12} className="mt-4">
                                <FormControlLabel
                                label="For Sale"
                                labelPlacement="start"
                                    control={
                                        <Switch
                                            checked={formik.values.type === 1}
                                            onChange={handleTypeChange}
                                        />
                                    }
                                    
                                />
                            </Col>
                        </Col>
                        
                        <Col md={6}>
                            <Col md={12}>
                                <div>
                                    <Barcode className="mt-3" value={formik.values.barcode} height={30} />
                                </div>
                                <div>
                                    <TextField
                                        disabled
                                        className="mt-4"
                                        label="Barcode"
                                        name="barcode"
                                        value={formik.values.barcode}
                                        onBlur={formik.handleBlur}
                                        sx={{
                                            maxWidth: 300,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'gray',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col md={12}>
                                <TextField
                                    disabled
                                    className="mt-4"
                                    label="Jewellery Code"
                                    variant="outlined"
                                    name="code"
                                    value={formik.values.code}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        width: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    className="mt-4"
                                    label="Jewellery Name"
                                    variant="outlined"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        width: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    className="mt-4"
                                    label="Labor Cost"
                                    name="laborCost"
                                    value={formik.values.laborCost}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    sx={{
                                        maxWidth: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    className="mt-4"
                                    label="Warranty Time"
                                    name="warrantyTime"
                                    value={formik.values.warrantyTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    sx={{
                                        maxWidth: 300,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'gray',
                                            },
                                        },
                                    }}
                                />
                            </Col>

                        </Col>
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
                                    style={{ width: '90%' }}
                                />
                            </InputGroup>
                            <InputGroup className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="goldtype-autocomplete"
                                    options={goldtype}
                                    value={goldtype.find(
                                        (option) =>
                                            option.value === formik.values.jewelryMaterial.goldId
                                    )}
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryMaterial.goldId',
                                            value ? value.value : ''
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Gold Type" />
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <InputGroup className="mb-4 mt-3">
                                <Form.Label>
                                    Gem Quantity: {formik.values.jewelryMaterial.gemQuantity} grams
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
                                    style={{ width: '90%' }}
                                />
                            </InputGroup>
                            <InputGroup className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="gemtype-autocomplete"
                                    options={gemtype}
                                    value={gemtype.find(
                                        (option) =>
                                            option.value === formik.values.jewelryMaterial.gemId
                                    )}
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryMaterial.gemId',
                                            value ? value.value : ''
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Gem Type" />
                                    )}
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup className="mb-4 mt-3">
                                <Autocomplete
                                    disablePortal
                                    id="jewellerytype-autocomplete"
                                    options={jewelryTypes}
                                    value={
                                        jewelryTypes.find(
                                            (option) => option.value === formik.values.jewelryTypeId
                                        ) || null
                                    }
                                    onChange={(event, value) =>
                                        formik.setFieldValue(
                                            'jewelryTypeId',
                                            value ? value.value : ''
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Jewellery Type" />
                                    )}
                                />
                            </InputGroup>
                        </Col>

                        {!CommonFunction.IsStaff() && (
                            <Col md={6}>
                                <InputGroup className="mb-4 mt-3">
                                    <Autocomplete
                                        multiple
                                        id="counter-autocomplete"
                                        options={counters}
                                        value={formik.values.jewelryCounters.map((counter) =>
                                            counters.find(
                                                (item) => item.value === counter.counterId
                                            )
                                        )}
                                        onChange={(event, value) =>
                                            formik.setFieldValue(
                                                'jewelryCounters',
                                                value.map((item) => ({ counterId: item.value }))
                                            )
                                        }
                                        onBlur={formik.handleBlur}
                                        sx={{ width: 600 }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Counters" />
                                        )}
                                    />
                                </InputGroup>
                            </Col>
                        )}
                    </Row>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

EditModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired,
};
