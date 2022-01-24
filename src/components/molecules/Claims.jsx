/** @format */

import { React, Fragment, PropTypes } from 'globals.jsx';
import { Grid, List, ListItem } from '@mui/material';
import { Typography } from 'components';

const Claims = ({ claims }) =>
  claims.map((attribute) => (
    <ListItem key={attribute.key} primary={attribute.key} secondary={attribute.value} />
  ));

Claims.defaultProps = {
  claims: [],
};

Claims.propTypes = {
  claims: PropTypes.array,
};

export default Claims;
