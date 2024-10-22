import React from "react";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";

const App = () => {
  return (
    <div>
      <h1>Book Management Application</h1>
      <AddBook />
      <BookList />
    </div>
  );
};

export default App;
