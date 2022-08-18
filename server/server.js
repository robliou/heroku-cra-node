const http = require("http");
/* const jwt = require("express-jwt");
 */ const { expressjwt: jwt } = require("express-jwt");
const env = require("./lib/env");
/* const logger = require("./lib/logger");
 */ const getPublicKey = require("./lib/getPublicKey");
require("dotenv").config();
/*
 * Initialize express.
 */
const express = require("express");
const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

/*
 * Middleware that will validate the incoming access token.
 */
const jwtCheck = jwt({
  secret: getPublicKey("dev-7-8i89hb.us.auth0.com"),
  audience: process.env.RESOURCE_SERVER,
  algorithms: ["RS256"],
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
});
/*
 * API endpoints.
 */

app.use(cors(corsOptions));

app.use("/api", jwtCheck, function (req, res, next) {
  if (req.user) {
    console.log(
      "Current user: " +
        req.user.sub +
        " (scope=" +
        (req.user.scope || "N/A") +
        ")"
    );
  }
  next();
});

/*
 * Error handler
 */
app.use(function (err, req, res, next) {
  if (err) {
    console.log("Unauthorized:", err.message);
    return res.status(401).send({ message: err.message });
  }

  next(err, req, res);
});

app.get("/users", (req, res, next) => {
  console.log(res);
});

/*
 * Start server.
 */
http.createServer(app).listen(env("PORT"), function () {
  console.log(
    "Worldmappers API (Resource Server) listening on: http://localhost:" +
      env("PORT")
  );
});
