let express = require("express");
let app = express();
const genid = require("uuid");
let createFolder = require("./process/createFolders");
let createImages = require("./process/createImages");
let writeManifest = require("./process/writeManifest");
let zipFile = require("./process/zipFile");
let delDocs = require("./process/delDocs");
const { ApolloServer, gql } = require("apollo-server-express");
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
      const { createReadStream, filename } = await file;
      let req = {
        dir: genid(),
        manifest: JSON.parse(manifest),
        stream: createReadStream(),
        filename
      };

      await createFolder(req);
      await createImages(req);
      await writeManifest(req);
      await zipFile(req);
      await delDocs(req);

      return req.fileString;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });
app.get("/", (req, res) => {
  return res.json({ say: "hi" });
});
app.listen(process.env.PORT || 8080, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
