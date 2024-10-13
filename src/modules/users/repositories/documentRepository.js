const Document = require('../models/Document');

exports.createDocument = async (documentData) => {
  return await Document.create(documentData);
};
