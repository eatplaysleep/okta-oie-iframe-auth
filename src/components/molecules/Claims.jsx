/** @format */

import { Fragment } from 'react';
import { Grid } from '@mui/material';
import { Typography } from '../../components';

export const Claims = ({ data }) =>
	data.map(attribute => (
		<Fragment key={attribute.key}>
			<Grid item xs={6}>
				<Typography gutterBottom>{attribute.key}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography gutterBottom>{attribute.value}</Typography>
			</Grid>
		</Fragment>
	));
