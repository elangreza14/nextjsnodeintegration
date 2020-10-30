const next = require("next");
const cors = require("cors");
const express = require("express");
const { connect } = require("mongoose");
const bodyParser = require("body-parser");
const { success, error } = require("consola");
const passport = require("passport");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const { databaseUrl } = require("../config/config").completeConfig[
  process.env.NODE_ENV || "default"
];

app
  .prepare()
  .then(() => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(passport.initialize());
    require("./middleware/passport")(passport);
    app.use("/api/user", require("./routes/users"));

    const startApp = async () => {
      try {
        await connect(databaseUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        });
        success({ message: `mongoose database is running`, badge: true });

        app.get("*", (req, res) => {
          return handle(req, res);
        });

        app.listen(3000, (err) => {
          if (err) {
            throw err;
          } else {
            success({
              message: `server ready on port ${3000}`,
              badge: true,
            });
          }
        });
      } catch (err) {
        error({
          message: `Unable Connect With Database ${err}`,
          badge: true,
        });
        startApp();
      }
    };

    startApp();
  })
  .catch((ex) => {
    console.log(ex);
    process.exit(1);
  });
