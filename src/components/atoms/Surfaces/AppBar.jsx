/** @format */

import * as React from 'react';
import MuiAppBar from '@mui/material/AppBar';

export const AppBar = (props) => {
  return <MuiAppBar elevation={0} position='sticky' {...props} />;
};
