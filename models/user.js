const mongoose = require('mongoose');
const validator = require('validator');

// создание экземпляра схемы с необходимыми полями
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'В поле "Имя" должно быть не менее 2 символов'],
    maxlength: [30, 'В поле "Имя" должно быть не более 30 символов'],
    required: [true, 'Поле "Имя" не является валидным. В нем должно быть от 2 до 30 символов'],
  },
  about: {
    type: String,
    minlength: [2, 'В поле "О себе" должно быть не менее 2 символов'],
    maxlength: [30, 'В поле "О себе" должно быть не более 30 символов'],
    required: [true, 'Поле "О себе" не является валидным. В нем должно быть от 2 до 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: [true, 'Поле "аватар" не является валидным'],
  },
  email: {
    type: String,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    required: [true, 'Поле "email" не является валидным'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле "password" не является валидным'],
    minlength: 8,
  }
});

// создание модели пользователя
module.exports = mongoose.model('user', userSchema);
