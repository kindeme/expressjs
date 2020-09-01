const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const favoriteSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectID,
			ref: "User",
		},
		campsites: [{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Campsite",
		}],
	},

	{
		timestamps: true,
	}
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
