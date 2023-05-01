import { useEffect } from "react";
import Router from "next/router";
import useRequests from "../../hooks/use-requests";

const Signout = () => {
  const { doRequest } = useRequests({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out ....</div>;

};

export default Signout;