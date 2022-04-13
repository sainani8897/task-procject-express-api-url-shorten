const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const port = 3000;
const shortid = require("shortid");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Mongo Client */
const client = new MongoClient("mongodb://localhost:27017/test_crud");

const collection = client.db().collection("short_urls");

const baseUrl = `http://localhost:${port}/`;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/:code", async (req, res) => {
  try {
    const url = await collection.findOne({
      code: req.params.code,
    });
    if (url) {
      return res.redirect(url.original_url);
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    // exception handler
    console.error(err);
    res.status(500).json("Server Error");
  }
});

app.post("/", async (req, res) => {
  try {
    if (req.body) {
      const data = req.body;

      const url = await collection.findOne({
        original_url: data.url,
      });

      if(url){
        return res.send({
          status: 200,
          data: {
            url: url.short_url,
          },
        });
      }


      if (data.url && validURL(data.url)) {
        const code = shortid.generate();
        const short_url = baseUrl + code;
        const response = await collection.insertOne({
          short_url,
          code,
          original_url: data.url,
        });

        return res.send({
          status: 200,
          data: {
            url: short_url,
          },
        });
      } else {
        return res.send({
          error: "give a valid url",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({error});
  }
  
});

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

client
  .connect()
  .then(function (client) {
    app.listen(port, () => {
      console.log("Server Started at Port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
