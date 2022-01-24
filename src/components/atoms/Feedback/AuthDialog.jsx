/** @format */

import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AuthDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    padding: 0,
    overflowY: 'unset',
    margin: 0,
    background: 'white',
  },
  '& .MuiDialog-root': {
    padding: 0,
    overflowY: 'unset',
    margin: 0,
  },
  '& .MuiDialogContent-root': {
    padding: 0,
    overflowY: 'unset',
    margin: 0,
  },
  '& .MuiDialogTitle-root': {
    padding: 0,
    overflowY: 'unset',
    margin: 0,
  },
}));
