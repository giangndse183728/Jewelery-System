import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import axios from 'axios';
import request from 'src/request';
import TableNoData from '../table-no-data';
import UserTableRow from '../sale-table-row';
import UserTableHead from '../sale-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../sale-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import InvoiceTemplate from '../sale-form';

// ----------------------------------------------------------------------

export default function SalePage() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showBillForm, setShowBillForm] = useState(false);
    const [bills, setBills] = useState([]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = bills.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const fetchBill = async () => {
        try {
            const response = await request.get('Bill/GetBills?type=1');
            setBills(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBill();
    }, []);

    const dataFiltered = applyFilter({
        inputData: bills ?? [],
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    const handleCloseBillForm = () => {
        setShowBillForm(false);
        fetchBill();
    };

    const handleNewBillClick = (newBillData) => {
        setShowBillForm(true);
    };

    return (
        <Container
            style={{
                marginLeft: 0,
                marginRight: 0,
                maxWidth: '100%',
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Sale</Typography>

                <Button
                    onClick={() => setShowBillForm(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    New Sale Bill
                </Button>

                {showBillForm && (
                    <InvoiceTemplate open={showBillForm} onClose={handleCloseBillForm} />
                )}
            </Stack>

            <Card>
                <UserTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={bills.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'billId', label: 'BillId' },
                                    { id: 'customerName', label: 'Customer Name' },
                                    { id: 'staffName', label: 'Staff Name' },
                                    { id: 'discountRate', label: 'Discount Rate' },
                                    { id: 'totalAmount', label: 'TotalAmount' },
                                    { id: 'saleDate', label: 'Sale Date' },
                                    { id: 'paymentStatus', label: 'Payment Status' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.billId}
                                            row={row}
                                            selected={selected.indexOf(row.billId) !== -1}
                                            handleClick={(event) => handleClick(event, row.billId)}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, bills.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={bills.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
