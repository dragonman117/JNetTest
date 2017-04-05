/**
 * Created by timothyferrell on 3/29/17.
 */

module.exports = {
    //check for logged in ...
    isLoggedIn:function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() ){
            return next();
        }
        // if they aren't redirect them to the home page
        res.redirect('/login');
    },
    isLoggedInAdmin:function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() ){
            if(req.session.passport.user.auth_level >= 499){
                return next();
            }
        }
        // if they aren't redirect them to the home page
        res.redirect('/admin/login');
    }
};