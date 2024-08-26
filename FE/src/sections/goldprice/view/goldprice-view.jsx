import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import request from 'src/request';
import GoldpriceTableNoData from '../goldprice-no-data';
import GoldpriceTableHead from '../goldprice-table-head';
import GoldpriceTableEmptyRows from '../goldprice-empty-rows';
import GoldpriceTableRow from '../goldprice-table-row';
import GoldpriceTableToolbar from '../goldprice-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function GoldPriceView() {
    const [goldprice, setGoldprice] = useState([]);
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        getGoldprice();
    }, []);
    const getGoldprice = async () => {
        const res = await request.get('/Price/GetGoldPrices');
        setGoldprice(res.data);
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
            const newSelecteds = goldprice.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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
        inputData: goldprice ?? [],
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container
            style={{
                marginLeft: 0,
                marginRight: 0,
                maxWidth: '100%',
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4"> Gold Price </Typography>
            </Stack>

            <Card>
                <GoldpriceTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <GoldpriceTableHead
                                order={order}
                                orderBy={orderBy}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'city', label: 'City' },
                                    { id: 'buyPrice', label: 'Buy Price' },
                                    { id: 'sellPrice', label: 'Sell Price' },
                                    { id: 'type', label: 'Type' },
                                    { id: 'lastUpdated', label: 'Last Updated' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <GoldpriceTableRow
                                            key={row.goldId}
                                            city={row.city}
                                            buyPrice={row.buyPrice}
                                            sellPrice={row.sellPrice}
                                            type={row.type}
                                            lastUpdated={row.lastUpdated}
                                            selected={selected.indexOf(row.city) !== -1}
                                            handleClick={(event) => handleClick(event, row.city)}
                                        />
                                    ))}

                                <GoldpriceTableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, goldprice.length)}
                                />

                                {notFound && <GoldpriceTableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
