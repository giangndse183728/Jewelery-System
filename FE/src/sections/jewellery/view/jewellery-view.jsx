import axios from 'axios';
import { toast } from 'react-toastify';
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

import request from 'src/request';
import CommonFunction from 'src/utils/commonFunction';
import NewModal from '../jew-new-modal';
import TableNoData from '../table-no-data';
import UserTableRow from '../jew-table-row';
import UserTableHead from '../jew-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../jew-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function JewelleryView() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [jewList, setJewList] = useState([]);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        getJew();
    }, []);

    const getJew = async () => {
        try {
            const response = await request.get('Jewelry/GetJewelries');
            setJewList(response.data ?? []); // Cập nhật state với dữ liệu từ server
        } catch (error) {
            console.error('Error fetching jewellery:', error);
        }
    };

    const createJew = async (newItem) => {
        try {
            const response = await request.post('Jewelry/CreateJewelry', newItem);
            getJew();
            return response;
        } catch (error) {
            toast.error('Failed to create item. Please try again.', {
                position: 'bottom-right',
                theme: 'colored',
            });
        }
        return null;
    };

    const deleteJewellery = async (id) => {
        try {
            await request.delete(`Jewelry/DeleteJewelry/${id}`);
            getJew();
            toast.success('Delete successful !', {
                position: 'bottom-right',
                theme: 'colored',
            });
        } catch (error) {
            console.error('There was an error deleting the item:', error);
        }
    };
    const updateJew = async (id, updatedData) => {
        try {
            const response = await request.put(`Jewelry/UpdateJewelry/${id}`, updatedData);
            getJew();
            toast.success('Update successful !', {
                position: 'bottom-right',
                theme: 'colored',
            });
        } catch (error) {
            toast.error('Failed to update item. Please try again.', {
                position: 'bottom-right',
                theme: 'colored',
            });
            throw error;
        }
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
            const newSelecteds = jewList.map((n) => n.name);
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
        inputData: jewList ?? [],
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
            {!CommonFunction.IsStaff() && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4">Jewellery</Typography>
                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleShow}
                    >
                        New Jewellery
                    </Button>
                    {show && (
                        <NewModal show={show} handleClose={handleClose} createJew={createJew} />
                    )}
                </Stack>
            )}

            {CommonFunction.IsStaff() && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4">Jewellery</Typography>
                    <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleShow}
                    >
                        Expertise Jewellery
                    </Button>
                    {show && (
                        <NewModal show={show} handleClose={handleClose} createJew={createJew} />
                    )}
                </Stack>
            )}

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
                                rowCount={jewList.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'previewImage', label: 'Preview Image' },
                                    { id: 'code', label: 'Code' },
                                    { id: 'name', label: 'Name' },
                                    { id: 'jewelryType', label: 'JewelryType' },
                                    { id: 'totalPrice', label: 'TotalPrice' },
                                    { id: 'barcode', label: 'Barcode' },
                                    { id: 'type', label: 'Type' },
                                    { id: 'counters', label: 'Counters' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.jewelryId}
                                            row={row}
                                            selected={selected.indexOf(row.name) !== -1}
                                            handleClick={(event) => handleClick(event, row.name)}
                                            onDelete={deleteJewellery}
                                            onUpdate={updateJew}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, jewList.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={jewList.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
