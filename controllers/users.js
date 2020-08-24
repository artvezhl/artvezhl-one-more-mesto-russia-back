const User = require('../models/user');

const userErrorsHandler = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(400).send(err.message);
    return;
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
};

// возврат всех пользователей
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

// возврат пользователя по _id
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send({ message: `Пользователь с номером ${req.params.userId} отсутствует!` });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: `Пользователь с номером ${req.params.userId} отсутствует!` });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

// создание нового пользователя
module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.send(newUser);
  } catch (err) {
    userErrorsHandler(err, res);
  }
};

// обновление профиля
module.exports.updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedProfile = await
    User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true });
    res.send(updatedProfile);
  } catch (err) {
    userErrorsHandler(err, res);
  }
};

// обновление аватара
module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await
    User.findOneAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true });
    res.send(updatedAvatar);
  } catch (err) {
    userErrorsHandler(err, res);
  }
};
