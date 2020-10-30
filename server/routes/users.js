const router = require("express").Router();
const {
  userRegister,
  userLogin,
  userAuth,
  checkRole,
  serializeUser,
} = require("../utils/Auth");

// user registration
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "user", res);
});

router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

router.post("/register-superadmin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});

router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

router.post("/login-superadmin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

router.post("/profile", userAuth, async (req, res) => {
  const response = await serializeUser(req.user);
  return res.json({ message: "Success Load Profile", data: response });
});

router.get(
  "/user-protected",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json({ message: "Hello User", success: true });
  }
);

router.get(
  "/admin-protected",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json({ message: "Hello User", success: true });
  }
);

router.get(
  "/superadmin-protected",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json({ message: "Hello User", success: true });
  }
);

router.get(
  "/superadmin-admin-protected",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json({ message: "Hello admin ", success: true });
  }
);

module.exports = router;
