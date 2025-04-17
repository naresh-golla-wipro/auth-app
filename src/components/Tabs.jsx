import React, { useState } from "react";
import { useSelector } from "react-redux";

const Tabs = ({ activeTab, setActiveTab }) => {
  const { authorization } = useSelector((state) => state.auth);
  const { pages } = authorization;

  const tabs = [
    { id: 1, label: "Posts", page: 1 },
    { id: 2, label: "Todos", page: 2 },
    { id: 3, label: "Users", page: 3 },
    { id: 4, label: "Comments", page: 4 },
  ];

  const hasPageAccess = (page) => {
    return pages && pages.includes(page);
  };

  return (
    <div>
      {tabs.map((tab) => {
        if (hasPageAccess(tab.page)) {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? "lightblue" : "white",
                padding: "10px",
                margin: "5px",
                border: "1px solid gray",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Tabs;