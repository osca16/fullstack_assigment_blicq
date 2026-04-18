export function requireModerator(user: any) {
    if (user.role !== "MODERATOR") {
        throw new Error ("Forbidden");
    }
}