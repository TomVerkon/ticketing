import React, { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/use-requests';

const BaseSignxForm = ({ url, label }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: url,
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await doRequest();
  };

  return (
    <div className='container mt-3'>
      <form onSubmit={onSubmit}>
        <h1>{label}</h1>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            value={email}
            className='form-control'
            onChange={e => { setEmail(e.target.value); }}
            id='email'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            value={password}
            className='form-control'
            onChange={e => { setPassword(e.target.value); }}
            id='password'
          />
        </div>
        {errors}
        <button className='btn btn-primary mt-2'>{label}</button>
      </form>
    </div >
  );
};
export default BaseSignxForm;