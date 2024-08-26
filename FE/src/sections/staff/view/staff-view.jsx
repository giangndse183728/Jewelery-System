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
import { toast } from 'react-toastify';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { useParams, useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress, IconButton } from '@mui/material';
import request from 'src/request';
import TableNoData from '../table-no-data';
import UserTableRow from '../staff-table-row';
import StaffForm from '../create-staff-table';
import UserTableHead from '../staff-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../staff-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
// ----------------------------------------------------------------------

export default function StaffView() {
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showStaffForm, setShowStaffForm] = useState(false);
    const [staffs, setStaff] = useState([]);
    const [counter, setCounter] = useState({});

    const navigate = useNavigate();
    const { counterId } = useParams();

    const handleBeforeRouteChange = async () => {
        if (counterId) {
            const response = await request.get(`Counter/GetById/${counterId}`);
            const data = await response.json();
            setCounter(data);
        }
    };

    const handleBackNavigate = () => {
        if (counterId) {
            navigate(`/counter`);
        }
    };

    const getTitlePage = () => {
        let defaultTitle = 'Staff';
        if (counter && counter.name) {
            defaultTitle = `Staff of Counter: ${counter.name}`;
        }
        return defaultTitle;
    };

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        // if (event.target.checked) {
        //   const newSelecteds = staff.map((n) => n.name);
        //   setSelected(newSelecteds);
        //   return;
        // }
        // setSelected([]);
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
        inputData: staffs ?? [],
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    const handleCloseStaffForm = () => {
        setShowStaffForm(false);
    };

    const handleNewStaffClick = async (newStaffData, resetFormData) => {
        setIsLoading(true);
        const response = await request.post('User/AddUser', newStaffData);
        const data = response.data;
        setIsLoading(false);
        if (data.success) {
            fetchAllStaff();
            handleCloseStaffForm();
            toast.success('New staff has been added');
            if (resetFormData) {
                resetFormData();
            }
        } else {
            toast.error(data.message);
        }
    };

    const fetchAllStaff = async () => {
        let fetchLink = 'User/GetUsers';
        if (counterId) {
            fetchLink = `User/GetUsers?counterId=${counterId}`;
        }
        const response = await request.get(fetchLink);
        setStaff(response.data);
    };

    useEffect(() => {
        handleBeforeRouteChange();
        fetchAllStaff();
    }, []);

    return (
        <Container
            style={{
                marginLeft: 0,
                marginRight: 0,
                maxWidth: '100%',
            }}
        >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">
                    <IconButton onClick={handleBackNavigate} color="inherit">
                        <Iconify icon="eva:arrow-back-fill" />
                    </IconButton>
                    <span>{getTitlePage()}</span>
                </Typography>

                <Button
                    onClick={() => setShowStaffForm(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                >
                    New Staff
                </Button>
            </Stack>

            <StaffForm
                open={showStaffForm}
                onClose={handleCloseStaffForm}
                onSubmit={handleNewStaffClick}
                counterIdParam={counterId}
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
                                rowCount={staffs.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'code', label: 'Code' },
                                    { id: 'fullName', label: 'Full Name' },
                                    { id: 'email', label: 'Email' },
                                    { id: 'gender', label: 'Gender' },
                                    { id: 'phoneNumber', label: 'Phone Number' },
                                    { id: 'roleId', label: 'Role' },
                                    { id: 'counterName', label: 'Counter Name' },
                                    { id: 'status', label: 'Status' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.userId}
                                            row={row}
                                            selected={selected.indexOf(row.code) !== -1}
                                            handleClick={(event) => handleClick(event, row.code)}
                                            onReload={fetchAllStaff}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, staffs.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={staffs.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
