import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Grid,
  Card,
  Box,
  Table,
  Input,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [Wallet, setWallet] = useState('');
  const [balance, setBalance] = useState('');
  const [money, setMoney] = useState('');
  const [receiveAdress, setReceiveAdress] = useState('');

  /* ?????????????????? */
  const getBalance = () => {
    axios.get(`http://localhost:3001/balance`).then((res) => {
      setBalance(res.data.balance);
      console.log(res.data.balance);
    });
  };
  /* ???????????? */
  const sendTransaction = () => {
    alert('?????????????????????????');

    axios
      .post(`http://localhost:3001/sendTransaction`, { amount: money, address: receiveAdress })
      .then((res) => {
        console.log(res.body);
      });
  };

  const address = () => {
    axios.get(`http://localhost:3001/address`).then((res) => {
      setWallet(res.data.address);
      console.log(res);
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = USERLIST.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={6} />

        <Grid>
          <Button onClick={address}> ??? ??????????????????</Button>
          <Grid item md={4}>
            NODE 1 : <div>{Wallet}</div>
          </Grid>
          {/* 
                ?????? ?????? : button 

                ???????????? ???????????? : input
                ?????? ?????? : input
                ?????? ?????? : button
                          */}
          <Grid>
            <Button onClick={getBalance}>?????? ?????? ??????</Button>
            <div>?????? ?????? : {balance}</div>
          </Grid>
          ?????? ?????? :{' '}
          <Input
            onChange={(e) => {
              setReceiveAdress(e.target.value);
            }}
            value={receiveAdress}
            sx={{ width: '100%' }}
            placeholder="????????? ?????? ??????"
            type="text"
          />
          <br />
          ?????? ?????? :{' '}
          <Input
            onChange={(e) => {
              setMoney(e.target.value);
            }}
            value={money}
            sx={{ width: '100%' }}
            placeholder="????????? ????????????"
          />
          <Button onClick={sendTransaction}>????????????</Button>
        </Grid>
      </Container>
    </Page>
  );
}
