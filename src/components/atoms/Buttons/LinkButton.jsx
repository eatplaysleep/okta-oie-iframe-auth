/** @format */
import { React, PropTypes } from 'globals.jsx';
import { Link } from 'react-router-dom';
import { Button } from 'components';

const LinkButton = ({ to, children, ...props }) => {
  const combinedProps = {
    color: 'secondary',
    variant: 'contained',
    size: 'large',
    sx: { minWidth: 200 },
    ...props,
  };
  return (
    <Button to={to} {...combinedProps} component={Link}>
      {children}
    </Button>
  );
};

LinkButton.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
};

export default LinkButton;
