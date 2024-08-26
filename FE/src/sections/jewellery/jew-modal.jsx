import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, Button, ListGroup } from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import Barcode from 'react-barcode';
import './view-jew-modal.css';
import request from 'src/request';

export default function InfoModal({ show, handleClose, row }) {
    const previewImg = `http://localhost:5188/api/File/image/${row.previewImage}?type=1`;
    return (
        <Modal
            size="lg"
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{row.name}</Modal.Title>
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
                                    <strong>Barcode:</strong>{' '}
                                    <Barcode value={row.code} height={30} />
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Jewelry Price:</strong> {row.jewelryPrice}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Labor Cost:</strong> {row.laborCost}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Warranty Time:</strong> {row.warrantyTime}
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
                            <ListGroup.Item>
                                <strong>Counters:</strong>{' '}
                                {row.jewelryCounters
                                    ?.map((counter) => counter.counterName)
                                    .join(', ') ?? ''}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

InfoModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired,
};
