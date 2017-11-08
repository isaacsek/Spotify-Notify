const passport = require("passport");

module.exports = (app) => {
    // callback url after logged in
    app.get('/auth/google', passport.authenticate('google', {
            // give access  to these fields from google
            scope: ['profile', 'email']
        })
    );

    // callback url after logged in
    app.get('/auth/spotify', passport.authenticate('spotify', {
            // give access  to these fields from google
            scope: ['user-read-email', 'user-read-private']
        })
    );

    // we have code, diff process
    app.get("/auth/google/callback", passport.authenticate('google'), function(req, res) {
        // after successful login from passport, redirect to here
        res.redirect("/surveys");
    });

    // we have code, diff process
    app.get("/auth/spotify/callback", passport.authenticate('spotify'), function(req, res) {
        // after successful login from passport, redirect to here
        res.redirect("/dashboard");
    });

    app.get("/api/current_user", function(req, res) {
        res.send(req.user);
    });

    app.get("/api/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });
}
