import React, { useEffect, useState } from "react";
import dynamoDB from "../awsConfig";
import {
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [editingBookID, setEditingBookID] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedAuthor, setUpdatedAuthor] = useState("");
  const [updatedPublishedDate, setUpdatedPublishedDate] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const params = {
        TableName: "BooksTable",
      };

      try {
        const command = new ScanCommand(params);
        const data = await dynamoDB.send(command);
        setBooks(data.Items);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const deleteBook = async (bookID) => {
    const params = {
      TableName: "BooksTable",
      Key: {
        bookID: bookID,
      },
    };

    try {
      const command = new DeleteCommand(params);
      await dynamoDB.send(command);
      setBooks(books.filter((book) => book.bookID !== bookID));
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const startEditing = (book) => {
    setEditingBookID(book.bookID);
    setUpdatedTitle(book.title);
    setUpdatedAuthor(book.author);
    setUpdatedPublishedDate(book.publishedDate);
  };

  const updateBook = async () => {
    const params = {
      TableName: "BooksTable",
      Key: {
        bookID: editingBookID,
      },
      UpdateExpression:
        "set #title = :title, #author = :author, #publishedDate = :publishedDate",
      ExpressionAttributeNames: {
        "#title": "title",
        "#author": "author",
        "#publishedDate": "publishedDate",
      },
      ExpressionAttributeValues: {
        ":title": updatedTitle,
        ":author": updatedAuthor,
        ":publishedDate": updatedPublishedDate,
      },
    };

    try {
      const command = new UpdateCommand(params);
      await dynamoDB.send(command);
      setBooks(
        books.map((book) =>
          book.bookID === editingBookID
            ? {
                ...book,
                title: updatedTitle,
                author: updatedAuthor,
                publishedDate: updatedPublishedDate,
              }
            : book
        )
      );
      setEditingBookID(null);
      setUpdatedTitle("");
      setUpdatedAuthor("");
      setUpdatedPublishedDate("");
      alert("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Book List</h2>
      <ul className="space-y-4">
        {books.map((book, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {book.bookID} - {book.title} - {book.author} -{" "}
              {book.publishedDate}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => deleteBook(book.bookID)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => startEditing(book)}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingBookID && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Update Book</h3>
          <input
            type="text"
            placeholder="Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="border rounded-lg p-2 w-full mb-4"
          />
          <input
            type="text"
            placeholder="Author"
            value={updatedAuthor}
            onChange={(e) => setUpdatedAuthor(e.target.value)}
            className="border rounded-lg p-2 w-full mb-4"
          />
          <input
            type="date"
            placeholder="Published Date"
            value={updatedPublishedDate}
            onChange={(e) => setUpdatedPublishedDate(e.target.value)}
            className="border rounded-lg p-2 w-full mb-4"
          />
          <div className="space-x-2">
            <button
              onClick={updateBook}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingBookID(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
