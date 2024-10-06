const express = require('express');
const bodyparser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const db = require('./Config/db');
const cors = require('cors');
app.use(cors());
const http = require("http");
app.use('/uploads', express.static('uploads'));


app.get("/",function(req,res){
    res.send("Welcome to Doctor App");
})
  

const userRoutes = require("./router/user_route");
app.use("/", userRoutes);

const httpServer = http.createServer(app);


const PORT = 5000;
const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('>>>>>>>Connection has been established successfully<<<<<<<<<');
    // await db.sequelize.sync({ alter: true });
    httpServer.listen( PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
start();
