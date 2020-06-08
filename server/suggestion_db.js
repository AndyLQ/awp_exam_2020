class Db {
  constructor(mongoose) {
    const suggestionSchema = new mongoose.Schema({
      content: String,
      signatures: [
        {
          name: String,
          date: String,
        },
      ], // A list of signatures as string
    });

    // This model is used in the methods of this class to access Suggestions
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

  async fillIfEmpty() {
    let l = (await this.getSuggestions()).length;

    if (l === 0) {
      console.log("Adding data because database was empty!");
      let promises = [];

      let suggestion1 = new this.suggestionModel({
        content: "We should get 5G in Aarhus",
        signatures: [{ name: "Andy" }, { name: "Kasia" }],
      });
      promises.push(suggestion1.save());

      let suggestion2 = new this.suggestionModel({
        content: "Justice for George Floyd",
        signatures: [{ name: "Andy" }],
      });
      promises.push(suggestion2.save());

      let suggestion3 = new this.suggestionModel({
        content: "End hunger pls",
        signatures: [{ name: "Andy" }, { name: "Kasia" }, { name: "Luka" }],
      });
      promises.push(suggestion3.save());

      return Promise.all(promises);
    }
  }
}

// We export the object used to access the Suggestions in the database
module.exports = (mongoose) => new Db(mongoose);
