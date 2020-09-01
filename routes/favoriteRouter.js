const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const bodyParser = require("body-parser");

const favoriteRouter = express.Router();

//favoriteRouter.use(bodyParser.json());

favoriteRouter
	.route("/")
	.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
		res.sendStatus(200)
	)
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorite.find({ user: req.user._id })
			.populate("user")
			.populate("campsites")
			.then((favorites) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(favorites);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					req.body.forEach((fav) => {
						if (!favorite.campsites.includes(fav._id)) {
							favorite.comments.push(fav._id);
						}
					});
					favorite.save().then((favorite) => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(favorite);
					});
				} else {
					Favorite.create({ user: req.user._id, campsites: req.body })
						.then((favorite) => {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							res.json(favorite);
						})
						.catch((err) => next(err));
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /favorites");
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.deleteMany()
			.then((response) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(response);
			})
			.catch((err) => next(err));
	});

favoriteRouter
	.route("/:campsiteId")
	.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
		res.sendStatus(200)
	)
	.get(cors.cors, (req, res, next) => {
		res.statusCode = 403;
		res.end("the operation is not supported.");
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favorite) => {
				if (favorite) {
					if (!favorite.campsites.includes(req.params.campsiteId)) {
						favorite.campsites.push(req.params.campsiteId);
						favorite.save().then((favorite) => {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							res.json(favorite);
						});
					} else {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.end("That campsite is already in the list of favorites");
					}
				} else {
					Favorite.create({
						user: req.user._id,
						campsites: req.params.campsiteId,
					})
						.then((favorite) => {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							res.json(favorite);
						})
						.catch((err) => next(err));
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
		Favorite.findByIdAndUpdate(
			req.params.campsiteId,
			{
				$set: req.body,
			},
			{ new: true }
		)
			.then((favorite) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(favorite);
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorite.findByIdAndDelete(req.params.campsiteId)
			.then((response) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(response);
			})
			.catch((err) => next(err));
	});

module.exports = favoriteRouter;
