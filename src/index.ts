import express, { Request, Response } from "express";
import "dotenv/config";
import { User, Content, Link } from "./db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { random } from "./util";
import cors from "cors";

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET_USER;

app.use(express.json());
app.use(cors())

// Todo : zod input validation , password hashing pending
app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await User.findOne({
    username,
  });

  if (existingUser) {
    res.status(403).json({
      data: "You already signup",
    });
  } else {
    await User.create({
      username,
      password,
    });
    res.status(200).json({
      data: "success",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await User.findOne({
    username,
    password,
  });

  if (!existingUser) {
    res.status(403).json({
      data: "Invalid Credentials",
    });
  } else {
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET!);
    res.status(200).json({
      data: token,
    });
  }
});

interface UserIdRequest extends Request {
  userId?: string;
}

app.post("/api/v1/content", userMiddleware, async (req: UserIdRequest, res: Response) => {
    const { link, title, type } = req.body;
    await Content.create({
      link,
      title,
      type,
      //@ts-ignore   // -- remember its can ignore the ts types
      userId: req.userId,
      tags: [],
    });

    res.status(200).json({
      message: "content Added",
    });
  }
);

app.get("/api/v1/content", userMiddleware, async (req: UserIdRequest, res) => {
  const content = await Content.find({
    userId: req.userId,
  }).populate("userId", "username");

  res.status(200).json({
    content: content,
  });
});

app.delete("/api/v1/content/:contentId", userMiddleware, async (req, res) => {
  const contentId = req.params.contentId;

  const status = await Content.deleteMany({
    _id : contentId,
    // @ts-ignore
    userId : req.userId,
  });
  
  res.status(200).json({
    message: "Content Deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async(req, res) => {
  const share = req.body.share;
  // @ts-ignore
  const userId = req.userId; 
  if(share){

    const value = await Link.findOne({
      userId
    })

    if(value) {
      res.json({
        hash: value.hash
      })
      return;
    }
    const hash = random(10);
    
    await Link.create({
      hash,
      userId 
    })
    res.json({
      hash:  hash
    })
  }else{
    await Link.deleteMany({
      userId
    })

    res.json({
      message : "Link deleted"
    })
  }
});

app.get("/api/v1/brain/:shareLink" , async(req, res) => {
  const hash = req.params.shareLink;
  const link = await Link.findOne({
    hash
  })
  if(link){
    const data = await Content.findOne({
      userId : link.userId
    })
    
    const user = await User.findOne({
      _id: data?.userId
    },"username")
    
    if(!user){
      res.status(411).json({
        message : "user Not found, Backend error should not happen "
      })
      return
    }

    res.status(200).json({
      username : user.username,
      data
    })
    
  }else{
    res.status(400).json({
      message : "invalid link"
    })    
  }

});

app.listen(port, async () => {
  await mongoose.connect(`${process.env.DB_KEY}`);
  console.log(`App running on port ${port}`);
});
