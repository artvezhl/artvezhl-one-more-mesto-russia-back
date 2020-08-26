const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
      res.status(404).send({ message: `Пользователь с номером ${req.params.userId} отсутствует` });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: `Пользователь с номером ${req.params.userId} отсутствует` });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

// TODO неверная ошибка (500) при создании пользователя с дублирующей почтой
// создание нового пользователя
module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar, email } = req.body;
    // TODO нужна дополнительная проверка на длину пароля
    //  https://yandex-students.slack.com/archives/GSEU66VNV/p1597943100017500?thread_ts=1597942917.017400&cid=GSEU66VNV
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({ name, about, avatar, email, password });
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

// TODO rebuild to async/await
// контроллер login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        // TODO возможно надо заменить user._id на статический
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d'}
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message })
    })
}
