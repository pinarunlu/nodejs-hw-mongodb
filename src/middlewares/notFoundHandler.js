import createError from 'http-errors';  // http-errors'ı import ediyoruz

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Route not found'));  // http-errors kullanarak 404 hatası oluşturuyoruz
};

export default notFoundHandler;

