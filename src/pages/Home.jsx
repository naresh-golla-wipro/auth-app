import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthorization } from "../features/auth/authSlice";
import Tabs from "../components/Tabs";
import TabContent from "../components/TabContent";

const Home = () => {
  const dispatch = useDispatch();

  const { user, token, authProvider, authorization } = useSelector(
    (state) => state.auth
  );
  const { roles, pages } = authorization;
  const [activeTab, setActiveTab] = useState(1);

  console.log("user ,authProvider, token, ", user, authProvider, token);
  console.log("authorization:", authorization, "activeTab:", activeTab);

  useEffect(() => {
    // Manually set roles and pages for testing.. superAdmin || editAdmin || newAdmin || user and total 4 pages
    const initialAuthorizationData = {
      roles: ["superAdmin"],
      pages: [1, 2, 3],
    };
    if (token && user) {
      dispatch(updateAuthorization(initialAuthorizationData));
    }
  }, [token, dispatch, user, authProvider]);

  return (
    <div>
      <h1>Home Page</h1>
      {user && (
        <>
          <p>welcome: {user.name}</p>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent activeTab={activeTab} />
          {/* <p>roles:{user?.roles.map((item,index)=><span key ={index}>{item}</span>)}</p> */}
        </>
      )}
    </div>
  );
};
export default Home;
