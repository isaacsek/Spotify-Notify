const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("../config/keys");
const User = mongoose.model("users");

const axios = require("axios");

// user = mongoose model
passport.serializeUser(function(user, done) {
	// user.id = id assigned into entry in mongoDB because if use other auth methods, might not have
	done(null, user.id);
});

// id = mongoose model id
passport.deserializeUser(function(id, done) {
	User.findById(id).then(function(user) {
		done(null, user);
	});
});

// internal identifier of google
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback",
			proxy: true
		},
		async (accessToken, refreshToken, profile, done) => {
			//console.log('accessToken', accessToken);
			//console.log('refreshToken', refreshToken);
			//console.log('profile', profile);

			const existingUser = await User.findOne({ googleID: profile.id });
			if (existingUser) {
				// null is user is not found
				done(null, existingUser); // null = no error
				// could also return
			} else {
				// chain on promise to make sequentially
				const user = await new User({ googleID: profile.id }).save();
				done(null, user);
			}
		}
	)
);

passport.use(
	new SpotifyStrategy(
		{
			clientID: keys.spotifyClientID,
			clientSecret: keys.spotifyClientSecret,
			callbackURL: "/auth/spotify/callback",
            //proxy: true
		},
		async (accessToken, refreshToken, profile, done) => {
			console.log('accessToken:', accessToken);
			console.log('refreshToken:', refreshToken);
			//console.log('profile', profile);

			var config = {
				method: 'get',
				url: 'https://api.spotify.com/v1/me',
				headers: {
					Authorization: "Bearer " + accessToken,
				},
			};
			var spot_me = await axios(config);
			console.log("hello", spot_me.data);

			const existingUser = await User.findOne({ spotifyID: profile.id });
			if (existingUser) {
				// null is user is not found
				done(null, existingUser); // null = no error
				// could also return
			} else {
				// chain on promise to make sequentially
				const user = await new User({ spotifyID: profile.id }).save();
				done(null, user);
			}
		}
	)
);
