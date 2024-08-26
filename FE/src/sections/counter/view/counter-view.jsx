import { useState, useEffect } from 'react';
import axios from 'axios';

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
import { toast } from 'react-toastify';
import request from 'src/request';
import TableNoData from '../table-no-data';
import CounterTableRow from '../counter-table-row';
import CrateCounterForm from '../create-counter-table';
import CounterTableHead from '../counter-table-head';
import TableEmptyRows from '../table-empty-rows';
import CounterTableToolbar from '../counter-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function CounterView() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showCounterForm, setShowCounterForm] = useState(false);
    const [counter, setCounter] = useState([]);
    const [counters, addCounter] = useState([]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = counters.map((n) => n.name);
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
        inputData: counters ?? [],
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    const handleCloseCounterForm = () => {
        setShowCounterForm(false);
    };

    const handleNewCounterClick = async (newCounterData) => {
        const response = await request.post('Counter/CreateCounter', newCounterData);
        try {
            if (response.status === 200) {
                toast.success('Counter created successfully');
                fetchAllCounters();
            }
        } catch (error) {
            toast.error('Counter creation failed');
        }
    };

    const fetchAllCounters = async () => {
        const response = await request.get('Counter/GetCounters');
        addCounter(response.data);
        setCounter(response.data);
    };

    useEffect(() => {
        fetchAllCounters();
    }, []);

    return (
        <Container
            style={{
                marginLeft: 0,
                marginRight: 0,
                maxWidth: '100%',
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Counter</Typography>

                <Button
                    onClick={() => setShowCounterForm(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    New Counter
                </Button>
            </Stack>

            <CrateCounterForm
                open={showCounterForm}
                onClose={handleCloseCounterForm}
                onSubmit={handleNewCounterClick}
                counters={counters}
            />

            <Card>
                <CounterTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <CounterTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={counters.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'name', label: 'Counter Name' },
                                    { id: 'numOfStaff', label: 'Number of Staff' },
                                    { id: '', label: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <CounterTableRow
                                            key={row.counterId}
                                            row={row}
                                            selected={selected.indexOf(row.code) !== -1}
                                            handleClick={(event) => handleClick(event, row.code)}
                                            onReload={fetchAllCounters}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, counters.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={counters.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
