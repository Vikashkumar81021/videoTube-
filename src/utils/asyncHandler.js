const asyncHandler = (requestHandler) => {
  return (res, req, next) => {
    Promise.resolve(requestHandler(res, req, next)).catch((err) => next(err));
  };
};
export default asyncHandler;
