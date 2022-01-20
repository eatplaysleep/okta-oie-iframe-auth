/** @format */

import { Fragment } from 'react';
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import { Lock } from '@mui/icons-material';

export const Authenticators = ({ data }) => {
	const handleSetup = authenticatorId => {
		const url = `${process.env.REACT_APP_OKTA_URL}/idp/authenticators/setup/${authenticatorId}?fromURI=http://localhost:3000`;

		window.open(url);
	};

	return (
		<List sx={{ width: '100%' }}>
			{data?.map(
				({
					key,
					userId,
					name,
					factorType,
					provider,
					enrollment,
					status,
					_embedded,
					authenticator,
				}) => {
					const { phones } = _embedded || {};
					const { id } = authenticator || {};

					let canEnroll = (id && status === 'NOT_SETUP') ?? false,
						enrolledPhones = [],
						setupText = 'Setup';

					if (Array.isArray(phones) && phones.length > 0) {
						phones?.forEach(phone => {
							const {
								profile: { phoneNumber },
								status,
							} = phone;

							if (status === 'ACTIVE') {
								enrolledPhones.push(
									`${phoneNumber.substring(0, 2)}******${phoneNumber.substring(
										8,
										12
									)}`
								);
							}
						});
					}

					const buildEnrolledPhones = () =>
						enrolledPhones.map(phone => (
							<List>
								<ListItem key={phone}>{phone}</ListItem>
							</List>
						));

					if (enrolledPhones?.length > 0 && enrolledPhones?.length < 2) {
						canEnroll = true;
						setupText = 'Add Another';
					}
					return (
						<Fragment>
							<ListItem key={key} alignItems='flex-start'>
								<ListItemIcon>
									<Lock />
								</ListItemIcon>
								<ListItemText primary={factorType} secondary={provider} />
								{canEnroll && (
									<ListItemButton onClick={() => handleSetup(id)}>
										{setupText}
									</ListItemButton>
								)}
							</ListItem>
						</Fragment>
					);
				}
			)}
		</List>
	);
};
