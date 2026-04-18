import { findUserByEmail } from "../repository/userRepository";
export const getUserWithRole = async (email: string) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error("user not found");

    return user;
}