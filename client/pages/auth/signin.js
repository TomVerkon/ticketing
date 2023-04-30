import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-requests';
import BaseSignxForm from '../../components/BaseSignxForm';

const Signin = () => {
  return <BaseSignxForm url='/api/users/signin' label='Sign In' />;
};
export default Signin;