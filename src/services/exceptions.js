class MissingResourceError extends Error {
  constructor(data) {
    super();
    this.data = data;
  }
}

class ValidationError extends Error {
  constructor(data) {
    super();
    this.data = data;
  }
}

module.exports = {
  MissingResourceError,
  ValidationError
};
