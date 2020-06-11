const bcrypt = require("bcryptjs");

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
        content: "We should get 5G in Aarhus",
        body: "5G is the future, we dont like buffering and loading",
        date: "9. April 2020",
        uploadUser: "ALQ",
        signatures: [
          { name: "Martin", date: "13. December 2019" },
          { name: "Andy", date: "10. April 2020" },
        ],
      });
      promises.push(suggestion1.save());

      let suggestion2 = new this.suggestionModel({
        content: "Justice for George Floyd",
        body: "Black Lives Matter",
        date: "20. February 2020",
        uploadUser: "Jackson",
        signatures: [{ name: "John", date: "28. February 2020" }],
      });
      promises.push(suggestion2.save());

      let suggestion3 = new this.suggestionModel({
        content: "End hunger pls",
        body: "This is some broke ass concept, why not just eat?",
        date: "13. August 2019",
        uploadUser: "Todd Dillerson",
        signatures: [
          { name: "Sarah", date: "2. September 2019" },
          { name: "Lena", date: "1. January 2020" },
          { name: "Andy", date: "13. January 2020" },
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

      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(user1.password, 10, function (err, hash) {
          if (err) reject(err);
          else resolve(hash);
        });
      });
      user1.hash = hashedPassword;
      user1.password = "hidden";

      promises.push(user1.save());

      let user2 = new this.userModel({
        username: "idali",
        password: "beno",
        fullname: "Benjamin Idali",
        dateCreated: "11. June 2020",
        admin: false,
      });

      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(user2.password, 10, function (err, hash) {
          if (err) reject(err);
          else resolve(hash);
        });
      });
      user2.hash = hashedPassword;
      delete user2.password;

      promises.push(user2.save());

      let user3 = new this.userModel({
        username: "asferg",
        password: "dewd",
        fullname: "Alexander Asferg",
        dateCreated: "11. June 2020",
        admin: false,
      });

      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(user3.password, 10, function (err, hash) {
          if (err) reject(err);
          else resolve(hash);
        });
      });
      user3.hash = hashedPassword;
      delete user3.password;

      promises.push(user3.save());

      let user4 = new this.userModel({
        username: "len4",
        password: "bums",
        fullname: "Lena Seybold ",
        dateCreated: "11. June 2020",
        admin: true,
      });

      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(user4.password, 10, function (err, hash) {
          if (err) reject(err);
          else resolve(hash);
        });
      });
      user4.hash = hashedPassword;
      delete user4.password;

      promises.push(user4.save());
    }
  }
}

// We export the object used to access the Suggestions in the database
module.exports = (mongoose) => new Db(mongoose);
