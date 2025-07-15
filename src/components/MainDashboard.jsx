import React, { useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import MoviesDashboard from "./Dashboard";
import PaymentsDashboard from "./PaymentsDashboard";
import UserDashboard from "./UserDashboard";

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
      />

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "movies" ? (
          <MoviesDashboard
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        ) : (
          <PaymentsDashboard />
        )}
        {activeTab === "user" && <UserDashboard />}
      </main>
    </div>
  );
};

export default MainDashboard;
