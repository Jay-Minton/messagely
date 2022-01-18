const Router = require("express").Router;
const router = new Router();
const Message = require("../models/message");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureCorrectUser, async function(req, res, next) {
    try {
        const message = Message.get(req.params.id);
        return message;
    } catch (e) {
        return next(e);
    }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const { from_username, to_username, body } = res.body;
        const message = Message.create(from_username, to_username, body);
        return message;
    } catch (e) {
        return next(e);
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureCorrectUser, async function(req, res, next) {
    try {
        const message = Message.markRead(req.params.id);
        return message;
    } catch (e) {
        return next(e);
    }
});

 module.exports = router;