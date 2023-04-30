import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('currentUser', currentUser);
  const email = (currentUser && currentUser.email) ? currentUser.email : '';
  return (
    <div className='container mt-3'>
      <h1>
        Welcome to the Landing page {email}
      </h1>
      <button className='btn btn-danger'>Hello</button>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
