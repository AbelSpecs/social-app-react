import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from './../../config/config';

const signin = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if(!user)
            return res.status('401').json({ error: "User not found" });

        if(!user.authenticate(req.body.password))
            return res.status('401').json({ error: "Credentials do not match" });

        const token = jwt.sign({ _id: user._id}, config.jwtSecret)

        res.cookie('divineMole', token, { expires: new Date() + 9999 })

        console.log(res);

        return res.json({
            token, 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status('401').json({ error: "Could not sign in" });
    }


}
const signout = (req, res) => {
    res.clearCookie("divineMole");
    return res.status('200').json({
        message: "signed out"
    });
}

const requireSignin = expressJwt ({
    secret: config.jwtSecret,
    userProperty: 'auth'
});

const hasAuthorization = (req, res) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
}

export default { signin, signout, requireSignin, hasAuthorization }



