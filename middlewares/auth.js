import CustomErrorHandler from "../utils/customErrorHandler";
import Jwtservice from "../utils/jwtService";

export const authenticate= async (req,res,next)=>{
    const token = req.cookies['jwt_access'];
    // console.log(token);
    if(!token){
        return next(CustomErrorHandler.unAuthorized());
    }
    try {
        const { _id}= await Jwtservice.verify(token);
        const user={
            _id,
        }
        req.user=user;
        // console.log(user);
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
}