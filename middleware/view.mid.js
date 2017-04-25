/**
 * Created by timothyferrell on 3/29/17.
 */

let genConfig = require("../config/sysConfig.json");

module.exports = {
    //check for logged in ...
    getGlobals:function(req, res, next) {
        globals = {};
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()){
            globals.user = req.session.passport.user;
            delete globals.user.password;
        }else{
            globals.noUser = true;
        }
        globals.base_url = genConfig.rel_path;
        globals.full_url = genConfig.full_path;
        //globals.classSections = ['CS1400', 'MATH2200','DEATH2250'];
        req.viewData = globals;

        return next();

    }
};