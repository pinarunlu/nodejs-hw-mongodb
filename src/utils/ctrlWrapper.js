const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);  // Kontrolör fonksiyonunu çalıştırıyoruz
    } catch (err) {
      next(err);  // Hata oluşursa next ile errorHandler middleware'ini devreye alıyoruz
    }
  };
};

export default ctrlWrapper;
