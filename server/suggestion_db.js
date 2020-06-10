class Db {
  constructor(mongoose) {
    const suggestionSchema = new mongoose.Schema({
      content: String,
      date: String,
      signatures: [
        {
          name: String,
          date: String,
        },
      ],
    });

    this.suggestionModel = mongoose.model("suggestion", suggestionSchema);
  }

  async getSuggestions() {
    try {
      return await this.suggestionModel.find({});
    } catch (error) {
      console.error("getSuggestions:", error.message);
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

  async createSuggestion(newSuggestion) {
    try {
      let suggestion = new this.suggestionModel(newSuggestion);
      return await suggestion.save();
    } catch (error) {
      console.error("createSuggestion:", error.message);
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
        date: "9. April 2020",
        signatures: [
          { name: "Martin", date: "13. December 2019" },
          { name: "Andy", date: "10. April 2020" },
        ],
      });
      promises.push(suggestion1.save());

      let suggestion2 = new this.suggestionModel({
        content: "Justice for George Floyd",
        date: "20. February 2020",
        signatures: [{ name: "John", date: "28. February 2020" }],
      });
      promises.push(suggestion2.save());

      let suggestion3 = new this.suggestionModel({
        content: "End hunger pls",
        date: "13. August 2019",
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
}

// We export the object used to access the Suggestions in the database
module.exports = (mongoose) => new Db(mongoose);
