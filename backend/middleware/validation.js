const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const mediaValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('file_path').trim().notEmpty().withMessage('File path is required'),
  body('file_type').trim().notEmpty().withMessage('File type is required'),
  body('file_size').isInt({ min: 1 }).withMessage('File size must be a positive number'),
  body('description').optional().trim(),
  body('privacy_setting').optional().isIn(['public', 'private']).withMessage('Privacy setting must be either public or private'),
  validate
];

module.exports = { mediaValidation }; 