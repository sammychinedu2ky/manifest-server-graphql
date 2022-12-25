let express = require("express");
let app = express();
const genid = require("uuid");
var cors = require('cors')
let createFolder = require("./process/createFolders");
let createImages = require("./process/createImages");
let writeManifest = require("./process/writeManifest");
let zipFile = require("./process/zipFile");
let delDocs = require("./process/delDocs");
const { ApolloServer, gql } = require("apollo-server-express");


var corsOptions = {
  origin: 'https://manifest-gen.netlify.app',
  optionsSuccessStatus: 200 
}

//app.use(cors(corsOptions))
const typeDefs = gql`
  type Query {
    users: String
  }

  type Mutation {
    uploadFile(file: Upload!, manifest: String): String
  }
`;
const resolvers = {
  Query: {
    users: () => {
      return "https://github.com/sammychinedu2ky";
    }
  },
  Mutation: {
    uploadFile: async (_, { file, manifest }) => {
      console.log("generation started")
      const { createReadStream, filename } = await file;
      let req = {
        dir: genid(),
        manifest: JSON.parse(manifest),
        stream: createReadStream(),
        filename
      };

      await createFolder(req);
      console.log("foldercreated")
      await createImages(req);
      console.log("imagescreated")
      await writeManifest(req);
      console.log("manifestfilecreate")
      await zipFile(req);
      console.log("zipfilecreated")
      await delDocs(req);
      console.log("generation ended")
      return req.fileString;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: ["https://manifest-gen.netlify.app"]
  },
});

server.applyMiddleware({ app });
app.get("/", (req, res) => {
  return res.json({ say: "hi" });
});
app.listen(process.env.PORT || 8080, () =>
  console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
);
