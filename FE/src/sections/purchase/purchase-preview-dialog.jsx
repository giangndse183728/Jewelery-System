import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Table,
  Dialog,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Print as PrintIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


const InvoicePreviewDialog = ({ open, onClose, invoiceData }) => {
  const handlePrint = () => {
    window.print();
  };


  const handleDownload = () => {
    html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 792]
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <style>
        {`
          @media print {
            #invoiceTitle,
            #printButton,
            #downloadButton {
              display: none;
            }
          }
        `}
      </style>
      <DialogTitle id="invoiceTitle">Invoice Preview</DialogTitle>
      <DialogContent id='invoiceCapture'>

        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Box textAlign="left">
              <Typography variant="h5">Invoice #{invoiceData.invoiceNumber}</Typography>
              <Typography>Date: {new Date(invoiceData.currentDate).toLocaleDateString()}</Typography>
              <Typography>Due Date: {new Date(invoiceData.dueDate).toLocaleDateString()}</Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box textAlign="right">
           <img src="/assets/logo.svg" alt="" style={{ width: 90 }}/>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2 }} />

        <Grid container spacing={10}>
          {/* Bill To */}
          <Grid item xs={6}>
            <Typography variant="h6">Bill To:</Typography>
            <Typography>{invoiceData.billTo?.name}</Typography>
            <Typography>{invoiceData.billTo?.phoneNumber}</Typography>
            <Typography>{invoiceData.billTo?.address}</Typography>
          </Grid>

          {/* Bill From */}
          <Grid item xs={6}>
            <Typography variant="h6">Bill From:</Typography>
            <Typography>{invoiceData.billFrom?.userName}</Typography>
            <Typography>{invoiceData.billFrom?.email}</Typography>
            <Typography>{invoiceData.billFrom?.roleId}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: 2 }} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{(item.qty * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6">Subtotal:</Typography>
                  <Typography variant="h6">Discount:</Typography>
                  <Typography variant="h4">Total:</Typography>
                </Box>
              </TableCell>
              <TableCell align='right'>
                <Box display="flex" flexDirection="column" textAlign="right">
                  <Typography variant="h6">{invoiceData.currency} {invoiceData.subtotal.toFixed(2)}</Typography>
                  <Typography variant="h6">{invoiceData.currency} {invoiceData.discount.toFixed(2)}</Typography>
                  <Typography variant="h4">{invoiceData.currency} {invoiceData.total.toFixed(2)}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ marginY: 2 }} />
        <Grid container spacing={2}>
          {/* Payment Details and Terms & Condition */}
          <Grid item xs={6}>
            <Box>
              <Typography variant="h6">PAYMENT DETAIL</Typography>
              <Typography>Cash | Credit Card | PayPal</Typography>
            </Box>
            <Divider sx={{ marginY: 2 }} />
            <Box>
              <Typography variant="h6">TERMS & CONDITION</Typography>
              <Typography>
                Payment is due in 30 days from date of issue. Late fees will apply. Check our website for more details.
              </Typography>
            </Box>
            <Divider sx={{ marginY: 2 }} />
          </Grid>

          {/* Signature */}
          <Grid item xs={6}>
            <Box textAlign="center" sx={{ marginTop: 2 }}>
              <Typography variant="h4">Signature</Typography>
              <img
                src='assets/signature.png'
                alt="Signature"
                width={150}
                height={100}
              />
              <Typography>Truong Minh Phuoc</Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 2 }} />
        <Box textAlign="center" sx={{ marginTop: 2 }}>
          <Typography variant="h4">THANK YOU!</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button id="printButton" onClick={handlePrint} startIcon={<PrintIcon />}>Print</Button>
        <Button id="downloadButton" onClick={handleDownload} startIcon={<GetAppIcon />}>Download</Button>
      </DialogActions>
    </Dialog>
  );
};

InvoicePreviewDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invoiceData: PropTypes.object.isRequired,
};

export default InvoicePreviewDialog; 