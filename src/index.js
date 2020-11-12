import express from "express";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import * as Sentry from "@sentry/node";
import morgan from "morgan";
import "dotenv/config";
import route from "./routes/routerAPI";

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.Promise = global.Promise;
mongoose.connection.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error(`Database error ${err.message}`);
});

// eslint-disable-next-line no-underscore-dangle
global.__serverDir = __dirname;
Sentry.init({
  dsn: "https://8011920eb693416baa7c96f196c4f3f8@sentry.io/5170539",
});

const app = express();
app.set("view engine", "ejs");
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.get("/", (req, res) =>
  res.json({
    message: "Welcome to the Tractrac Server Apis",
  })
);
app.use("/api/v1", route);
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  Sentry.configureScope((scope) => {
    scope.setTag("user", req.userData ? req.userData : "");
    scope.setUser({
      email: req.userData && req.userData.email ? req.userData.email : "",
      phone: req.userData && req.userData.phone ? req.userData.phone : "",
    });
  });

  Sentry.captureException(error.error);
  res.status(500).json({
    message: error.message,
  });
});

// eslint-disable-next-line import/no-unresolved
// require("./utils/modelCreator")

const PORT = process.env.PORT || 8000;
// eslint-disable-next-line no-console
app.listen(PORT, () =>
  console.log(`Tractrac Server listening on port ${PORT}`)
);
