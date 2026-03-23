const getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    res.json({
      message: "Profile route working",
      username,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getProfile };