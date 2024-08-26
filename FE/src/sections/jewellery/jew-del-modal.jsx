import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBarcode,
    faMoneyBill,
    faDollarSign,
    faWeightHanging,
    faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import request from 'src/request';

export default function DelModal({ show, handleClose, onDelete, row }) {
    const previewImg = `http://localhost:5188/api/File/image/${row.previewImage}?type=1`;
    return (
        <Modal
            size="md"
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {' '}
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: 'red' }} />{' '}
                    &nbsp;Confirm Delete
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6} className="d-flex align-items-center justify-content-center">
                        <img src={previewImg} alt={row.name} className="info-modal-image" />
                    </Col>
                    <Col md={6}>
                        <ListGroup>
                            <ListGroup.Item>
                                <div>
                                    <strong>Barcode:</strong> <FontAwesomeIcon icon={faBarcode} />{' '}
                                    {row.code}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Jewelry Name:</strong> {row.name}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Jewelry Price:</strong> {row.jewelryPrice}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Labor Cost:</strong> {row.laborCost}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Gold Type:</strong> {row.materials[0]?.gold?.goldType}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Gold Weight:</strong> {row.materials[0]?.gold?.goldWeight}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Gold Price:</strong> {row.materials[0]?.gold?.goldPrice}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Gem Type:</strong> {row.materials[0]?.gem?.gemType}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Gem Quantity:</strong> {row.materials[0]?.gem?.gemQuantity}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Gem Price:</strong> {row.materials[0]?.gem?.gemPrice}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Total Price:</strong> {row.totalPrice}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="danger"
                    onClick={() => {
                        onDelete(row.jewelryId);
                        handleClose();
                    }}
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

DelModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired,
};
