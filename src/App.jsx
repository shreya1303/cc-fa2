import React from "react";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Book Management Application
      </h1>
      <AddBook />
      <BookList />
    </div>
  );
};

export default App;
