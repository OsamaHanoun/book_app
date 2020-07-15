DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  shelf VARCHAR(255),
  description TEXT,
  img_url VARCHAR(255),
  isbn VARCHAR(255)
);

INSERT INTO books (title, author, shelf, description, img_url,isbn) 
VALUES('title: Alice Adventures in Wonderland','author: Lewis Carroll','shelf: fairy teals','description: Adventure stories ','https://books.google.jo/books/content?id=btIQAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70UBGnrQxIXrUJZZbogrtmA2qWaMLNTdDNEQSHcRfEbB4PLDXXpQx0Y69xOBhpr0Y5kWnxR26JUc2-6KzAiSe-TBe4nRSgePmUYTDqLH9LYtMRWEAr0hgRXb2NFqLhLAUQb4n13','46541565161');
