import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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

import request from 'src/request';
import TableNoData from '../table-no-data';
import UserTableRow from '../customer-table-row';
import TableEmptyRows from '../table-empty-rows';
import UserTableHead from '../customer-table-head';
import CustomerForm from '../create-customer-table';
import UserTableToolbar from '../customer-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function CustomerPage() {
    const [customer, setCustomer] = useState([]);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [showCustomerForm, setShowCustomerForm] = useState(false);

    useEffect(() => {
        getCustomer();
    }, []);
    const getCustomer = async () => {
        const res = await request.get('Customer');
        setCustomer(res.data);
    };

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = customer.map((n) => n.name);
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

    const dataFiltered = applyFilter({
        inputData: customer ?? [],
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    const handleCloseCustomerForm = () => {
        setShowCustomerForm(false);
    };

    const handleNewCustomerClick = async (newCustomerData) => {
        const res = await request.post('Customer/CreateCustomer', newCustomerData);
        if (res.status === 200) {
            toast.success('Create customer successfully');
        } else {
            toast.error('Create customer failed');
        }
        getCustomer();

        setShowCustomerForm(false);
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
                <Typography variant="h4">Customer</Typography>

                <Button
                    onClick={() => setShowCustomerForm(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    New Customer
                </Button>
            </Stack>

            <CustomerForm
                open={showCustomerForm}
                onClose={handleCloseCustomerForm}
                onSubmit={handleNewCustomerClick}
                customers={customer}
            />

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
                                rowCount={customer.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'code', label: 'Code' },
                                    { id: 'fullName', label: 'Full Name' },
                                    { id: 'gender', label: 'Gender' },
                                    { id: 'address', label: 'Address' },
                                    { id: 'phone', label: 'Phone Number' },
                                    { id: 'point', label: 'Point' },
                                    { id: ' ', label: ' ' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.customerId}
                                            row={row}
                                            selected={selected.indexOf(row.customerId) !== -1}
                                            handleClick={(event) =>
                                                handleClick(event, row.customerId)
                                            }
                                            getCustomer={getCustomer}
                                            customers={customer}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, customer.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={customer.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
