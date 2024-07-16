const { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

// MongoDB Models
const Client = require('../models/Client');
const Project = require('../models/Project');

const clientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
})

const projectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: clientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {

    // clients entry point
    // ✅
    clients: {
      type: new GraphQLList(clientType),
      resolve(parent, args) {
        return Client.find();
      }
    },

    // ✅
    client: {
      type: clientType,
      args: { id: { type: GraphQLNonNull(GraphQLID) }},
      resolve(parent, args) {
        return Client.findById(args.id);
      }
    },

    // project entry points
    // ✅
    projects: {
      type: new GraphQLList(projectType),
      resolve(parent, args) {
        return Project.find();
      }
    },

    // ✅
    project: {
      type: projectType,
      args: { id: { type: GraphQLNonNull(GraphQLID) }},
      resolve(parent, args) {
        return Project.findById(args.id);
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    // Clients mutation
    // ✅
    addClient: {
      type: clientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const newClient = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone
        })
        return newClient.save();
      }
    },

    // ✅
    deleteClient: {
      type: clientType,
      args: { id: {type: GraphQLNonNull(GraphQLID)} },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id);
      }
    },

    // ✅
    updateClient: {
      type: clientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Client.findByIdAndUpdate(args.id, {
          name: args.name,
          email: args.email,
          phone: args.phone
        }, { new: true });
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})