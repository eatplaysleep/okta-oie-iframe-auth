/** @format */
import { getAvailableFactors } from '.';

const index = (req, res) => {
	try {
		return getAvailableFactors(req, res);
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
