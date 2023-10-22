// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  // get the payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  // if payload doesn't contain name of the book
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // if readPage is bigger than pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  // if payload contains name of the book and readPage is less than or equal to pageCount
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished;

  // assign value of finished property of book
  if (readPage < pageCount) {
    finished = false;
  } else {
    finished = true;
  }

  // create a book object to save
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // add a book to books array
  books.push(newBook);

  // check if the book is stored to books array
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // if success save the book
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  // if not success save the book
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

const getAllBooksHandler = (req, h) => {
  // get query
  const { name, reading, finished } = req.query;

  const returnValue = {
    status: 'success',
    data: {
      books,
    },
  };
  let returnBook;

  // if query name
  if (name !== undefined) {
    returnBook = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    returnValue.data.books = returnBook;
  }

  // if query reading
  if (reading !== undefined) {
    if (reading === '1') {
      returnBook = books.filter((item) => item.reading === true);
    } else if (reading === '0') {
      returnBook = books.filter((item) => item.reading === false);
    }

    returnValue.data.books = returnBook;
  }

  // if query finished
  if (finished !== undefined) {
    if (finished === '1') {
      returnBook = books.filter((item) => item.finished === true);
    } else if (finished === '0') {
      returnBook = books.filter((item) => item.finished === false);
    }

    returnValue.data.books = returnBook;
  }

  const filteredProperties = [];

  returnValue.data.books.forEach((item) => {
    filteredProperties.push({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    });
  });
  returnValue.data.books = filteredProperties;

  const response = h.response(returnValue);
  response.code(200);

  return response;
};

const getBookByIdHandler = (req, h) => {
  // get id of the book from request
  const { bookId } = req.params;

  // get book by id
  const book = books.filter((b) => b.id === bookId)[0];

  // make sure book is not undefined
  if (book !== undefined) {
    // return the book
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);

    return response;
  }

  // if the book is undefined
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};

const updateBookByIdHandler = (req, h) => {
  // get the payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  // if payload doesn't contain name of the book
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // if readPage is bigger than pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  // get id of the book
  const { bookId } = req.params;

  // get index of the id of the book
  const index = books.findIndex((book) => book.id === bookId);

  // if index is not -1
  if (index !== -1) {
    const updatedAt = new Date().toISOString();

    // update the book
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);

    return response;
  }

  // if id not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

const deleteBookByIdHandler = (req, h) => {
  // get id of the book
  const { bookId } = req.params;

  // get index of the book by id
  const index = books.findIndex((book) => book.id === bookId);

  // if book found
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

// ----------------------------------------------------------------

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
