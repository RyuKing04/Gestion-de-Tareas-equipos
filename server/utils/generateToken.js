import jwt from 'jsonwebtoken';

const generateToken = (userId) =>{
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export default generateToken;

// This function generates a JWT token for a user based on their userId.
// The token is signed with a secret key stored in the environment variable JWT_SECRET and is set to expire in 30 days.