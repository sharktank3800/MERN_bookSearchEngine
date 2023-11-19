// import user model
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      const userData = await User.findOne({ _id: context.user?._id }).select(
        "-__v -password"
      );

      if (!userData) {
        throw new Error("Not logged in");
      }

      return userData;
    },
  },

  Mutation : {
    createUser: async (_, { input }) => {
        try {
          const user = await User.create(input);
          const token = signToken(user);
          return { token, user };
        } catch (error) {
          throw new Error("User creation failed");
        }
      },
  
      login: async (_, { email, password }) => {
        try {
          const user = await User.findOne({ email });
          // Validate password and generate token
          // Implement your password validation logic here
          if(!user){
            throw new Error("incorrect credentials");
          }
          
        //   validate password
          const isPasswordValid = await user.isCorrectPassword(password);

          if(!isPasswordValid){
            throw new Error("incorrect password");
          }

        //   generate token upon successful login
          const token = signToken(user);
          return { token, user };
        } catch (error) {
          throw new Error("Login failed");
        }
      },


      saveBook: async (_, {input}, {currentLoggedUser}) => {

        try {

            if(!currentLoggedUser){
                throw new Error("user not authenticated");
            }

            const updatedUser = await User.findByIdAndUpdate(
                currentLoggedUser._id,
                {$addToSet: {savedBooks: book}},
                {new: true}
            );

            return updatedUser;

        } catch (error) {
            throw new Error("failed to save book")
        }
      },

      deleteBook: async(_, {bookId}, {currentLoggedUser}) => {
        try {
            if (!currentLoggedUser) {
                throw new Error("User is not authenticated")
            }

            const updatedUser = await User.findByIdAndUpdate(
                currentLoggedUser,
                {$pull: {savedBooks: {bookId}}},
                {new: true}
            );

            return updatedUser;

        } catch (error) {
            throw new Error(error)
        }
      }

    }

};
module.exports = resolvers;
