const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
});

// TODO rebuild to async/await
// метод для проверки почты и пароля
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

// создание модели пользователя
module.exports = mongoose.model('user', userSchema);
