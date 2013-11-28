
/*
 * GET users listing.
 */

exports.authUserdata = function (req, res) {
	if (req.session.user) {
		{	login: {
				authUser 	: "true",
				authUname	: req.session.user
			}
		};
	} else {

	}
}