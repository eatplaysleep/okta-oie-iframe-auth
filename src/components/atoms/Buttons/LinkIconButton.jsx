/** @format */
import { React, PropTypes } from 'globals.jsx';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

const LinkIconButton = ({ children, ...props }) => {
  const combinedProps = {
    size: 'large',
    color: 'inherit',
    component: Link,
    ...props,
  };

  return <IconButton {...combinedProps}>{children}</IconButton>;
};

LinkIconButton.propTypes = {
  children: PropTypes.node,
};

export default LinkIconButton;
