import React, { useState } from "react";
import dynamoDB from "../awsConfig";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const AddBook = () => {
  const [bookID, setBookID] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");

  const addBook = async () => {
    const params = {
      TableName: "BooksTable",
      Item: {
        bookID,
        title,
        author,
        publishedDate,
      },
    };

    try {
      const command = new PutCommand(params);
      await dynamoDB.send(command);
      alert("Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div>
      <h2>Add Book</h2>
      <input
        type="text"
        placeholder="Book ID"
        value={bookID}
        onChange={(e) => setBookID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="date"
        placeholder="Published Date"
        value={publishedDate}
        onChange={(e) => setPublishedDate(e.target.value)}
      />
      <button onClick={addBook}>Add Book</button>
    </div>
  );
};

export default AddBook;
