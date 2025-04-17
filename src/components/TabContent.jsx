import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const TabContent = ({ activeTab }) => {
  const { user, authorization } = useSelector((state) => state.auth);
  const { roles } = authorization;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/${
            activeTab === 1
              ? "posts"
              : activeTab === 2
              ? "todos"
              : activeTab === 3
              ? "users"
              : "comments"
          }`
        );
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const hasRole = (role) => {
    return roles && roles.includes(role);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Tab {activeTab} Content</h2>
      {/* Show Add/New button if permission exists */}
      {/* {permissions.includes("add") && (
        <button style={{ marginBottom: "10px" }}>Add New</button>
      )} */}
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.title || item.name}
            {hasRole("editAdmin") && (
              <button style={{ marginLeft: "10px" }}>Edit</button>
            )}
            {hasRole("superAdmin") && (
              <button style={{ marginLeft: "10px" }}>Delete</button>
            )}
          </li>
        ))}
      </ul>
      {hasRole("newAdmin") && <button>Add New Record</button>}
    </div>
  );
};

export default TabContent;
