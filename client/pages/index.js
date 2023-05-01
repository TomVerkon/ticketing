import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  const email = (currentUser && currentUser.email) ? currentUser.email : '';
  return (
    <div>
      <h1>
        {currentUser ? `Welcome ${email}` : 'You are NOT signed in'}
      </h1>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log('In LandingPage');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
