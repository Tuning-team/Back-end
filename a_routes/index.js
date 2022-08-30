const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes.js");
const Users = require("../d_schemas/user")

router.use("/", [authRouter]);
router.use("/DBtest", async (req, res) => {

    await Users.create({  
      user_id: "tester",
      email: "tester@test.com",
      firstName: "bohyeon",
      lastName: "kim",
      profilePicUrl: 
          "https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg",
      myCollectionsArr: [],
      likesArr: [],
      follwersArr: [],
      followingsArr: [],
      displayName: "Tester1",
      createdAt: new Date(),
        })

      res.redirect("/")

});

// 이 파일에서 만든 router 객체를 외부에 공개 -> app.js에서 사용할 수 있도록
module.exports = router;
