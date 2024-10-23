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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Add Book</h2>
      <input
        type="text"
        placeholder="Book ID"
        value={bookID}
        onChange={(e) => setBookID(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />
      <input
        type="date"
        placeholder="Published Date"
        value={publishedDate}
        onChange={(e) => setPublishedDate(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />
      <button
        onClick={addBook}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
      >
        Add Book
      </button>
    </div>
  );
};

export default AddBook;
