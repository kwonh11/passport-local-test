const express = require("express");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const passportConfig = require("./passport");
const userRouter = require("./route/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models/index.js");

dotenv.config();
const app = express();
passportConfig();

const driver = () => {
  sequelize
    .sync()
    .then(() => {
      console.log("초기화 완료.");
    })
    .catch((err) => {
      console.error("초기화 실패");
      console.error(err);
    });
};
driver();

app.use(morgan("dev"));
// credentials 옵션이 true인 경우 origin이 와일드 카드로 지정돼있으면 안된다.
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const storeOptions = {
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 1000 * 60 * 2, // 2분
  expiration: 1000 * 60, // 1분임
};
const sessionStore = new mysqlStore(storeOptions);

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === "production" && "hyuks",
    },
    store: sessionStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.listen(8080, () => {
  console.log("서버 실행 중!");
});
