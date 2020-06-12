const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

class Db {
  constructor(mongoose) {
    const suggestionSchema = new mongoose.Schema({
      content: String,
      body: String,
      date: String,
      uploadUser: String,
      signatures: [
        {
          name: String,
          date: String,
        },
      ],
    });

    this.suggestionModel = mongoose.model("suggestion", suggestionSchema);

    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      fullname: String,
      dateCreated: String,
      admin: Boolean,
      hash: String,
    });

    userSchema.pre("save", function (next) {
      if (!this.isModified("password")) {
        return next();
      }
      this.password = bcrypt.hashSync(this.password, 10);
      next();
    });

    userSchema.methods.comparePassword = function (plaintext, callback) {
      return callback(null, bcrypt.compareSync(plaintext, this.password));
    };

    this.userModel = mongoose.model("user", userSchema);
  }

  async getSuggestions() {
    try {
      return await this.suggestionModel.find({});
    } catch (error) {
      console.error("getSuggestions:", error.message);
      return {};
    }
  }

  async getUsers() {
    try {
      return await this.userModel.find({});
    } catch (error) {
      return {};
    }
  }

  getToday = () => {
    const today = new Date().getDate();
    let thisMonth = new Date().getMonth() + 1;

    if (thisMonth == 6) {
      thisMonth = "June";
    } else if (thisMonth == 7) {
      thisMonth = "July";
    } else if (thisMonth == 8) {
      thisMonth = "August";
    } else if (thisMonth == 9) {
      thisMonth = "September";
    } else if (thisMonth == 10) {
      thisMonth = "October";
    } else if (thisMonth == 11) {
      thisMonth = "November";
    } else if (thisMonth == 12) {
      thisMonth = "December";
    } else if (thisMonth == 1) {
      thisMonth = "January";
    } else if (thisMonth == 2) {
      thisMonth = "February";
    } else if (thisMonth == 3) {
      thisMonth = "March";
    } else if (thisMonth == 4) {
      thisMonth = "April";
    } else if (thisMonth == 5) {
      thisMonth = "May";
    }

    const thisYear = new Date().getFullYear();
    const postDate = today + ". " + thisMonth + " " + thisYear;
    return postDate;
  };

  async getSuggestion(id) {
    try {
      return await this.suggestionModel.findById(id);
    } catch (error) {
      console.error("getSuggestion:", error.message);
      return {};
    }
  }

  async getUser(id) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      console.error("getSuggestion:", error.message);
      return {};
    }
  }

  async createSuggestion(newSuggestion) {
    try {
      let suggestion = new this.suggestionModel(newSuggestion);
      return await suggestion.save();
    } catch (error) {
      console.error("createSuggestion:", error.message);
      return {};
    }
  }

  async crateUser(newUser) {
    try {
      let user = new this.userModel(newUser);
      return await user.save();
    } catch (error) {
      console.error("createUser: ", error.message);
      return {};
    }
  }

  async addSignature(suggestionID, newSignature) {
    //Gets the post by id
    const suggestion = await this.getSuggestion(suggestionID);

    suggestion.signatures.push(newSignature);
    return await suggestion.save();
  }

  async fillIfEmpty() {
    let l = (await this.getSuggestions()).length;

    if (l === 0) {
      console.log("Adding data because database was empty!");
      let promises = [];

      let suggestion1 = new this.suggestionModel({
        content: "We could all donate 5$ a month",
        body:
          "If we all would donate 5 Dollars to funds that needed it, more problems would be solved all over the world in no time!",
        date: "9. April 2020",
        uploadUser: "The Queen of England",
        signatures: [
          { name: "Amnesty", date: "13. December 2019" },
          { name: "Red barnet", date: "10. April 2020" },
        ],
      });
      promises.push(suggestion1.save());

      let suggestion2 = new this.suggestionModel({
        content: "We should all use the metric system ",
        body:
          "It would make everything easier! Imagine that everyone spoke the same language perfectly all over the world. Also we should drive in the right side. All of us.",
        date: "20. February 2020",
        uploadUser: "European Union",
        signatures: [{ name: "Dubai", date: "28. February 2020" }],
      });
      promises.push(suggestion2.save());

      let suggestion3 = new this.suggestionModel({
        content: "We should destroy Covid-19 once and for all!",
        body:
          "If we all stayed home, isolated, for one full month, the world would get rid of Covid-19/Corona. But it would also destroy the flu and other influenza. Think about it as having bad wifi at home and restarting your router to fix it. ",
        date: "13. August 2019",
        uploadUser: "Todd Dillerson",
        signatures: [
          { name: "Trick2g", date: "2. September 2019" },
          { name: "Welyn", date: "1. January 2020" },
          { name: "Blooprint", date: "13. January 2020" },
        ],
      });
      promises.push(suggestion3.save());

      return Promise.all(promises);
    }
  }

  async initUsers() {
    let numberOfUsers = (await this.getUsers()).length;

    if (numberOfUsers === 0) {
      console.log("Adding users because database was empty!");
      let promises = [];

      let user1 = new this.userModel({
        username: "alq",
        password: "quach",
        fullname: "Andy Le Quach",
        dateCreated: "10. June 2020",
        admin: true,
        hash: "",
      });

      promises.push(user1.save());

      let user2 = new this.userModel({
        username: "idali",
        password: "beno",
        fullname: "Benjamin Idali",
        dateCreated: "11. June 2020",
        admin: false,
      });

      promises.push(user2.save());

      let user3 = new this.userModel({
        username: "asferg",
        password: "dewd",
        fullname: "Alexander Asferg",
        dateCreated: "11. June 2020",
        admin: false,
      });

      promises.push(user3.save());

      let user4 = new this.userModel({
        username: "len4",
        password: "bums",
        fullname: "Lena Seybold ",
        dateCreated: "11. June 2020",
        admin: true,
      });

      promises.push(user4.save());
    }
  }
}

// We export the object used to access the Suggestions in the database
module.exports = (mongoose) => new Db(mongoose);
