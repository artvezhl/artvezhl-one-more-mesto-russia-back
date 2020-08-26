// TODO rebuild to async await
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация'});
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  console.log('____________________________________________');
  console.log(token);
  console.log('____________________________________________');

  try {
    // TODO найти на что надо заменить some-secret-key
    payload = jwt.verify(token, 'some-secret-key');
    console.log('____________________________________________');
    console.log(payload);
    console.log('____________________________________________');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация'});
  }

  req.user = payload;

  next();
}
