const testController = (req, res) => {
  res.status(200).send({
    message: 'test route welcome',
    success: true,
  })
};

module.exports = {testController}