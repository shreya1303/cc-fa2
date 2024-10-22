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
    <div>
      <h2>Book List</h2>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.bookID} - {book.title} - {book.author} - {book.publishedDate}
            <button onClick={() => deleteBook(book.bookID)}>Delete</button>
            <button onClick={() => startEditing(book)}>Update</button>
          </li>
        ))}
      </ul>

      {editingBookID && (
        <div>
          <h3>Update Book</h3>
          <input
            type="text"
            placeholder="Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={updatedAuthor}
            onChange={(e) => setUpdatedAuthor(e.target.value)}
          />
          <input
            type="date"
            placeholder="Published Date"
            value={updatedPublishedDate}
            onChange={(e) => setUpdatedPublishedDate(e.target.value)}
          />
          <button onClick={updateBook}>Save</button>
          <button onClick={() => setEditingBookID(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default BookList;
