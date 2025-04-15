import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();
    console.log(user);
    if (!user) {
        // Redirect user to login page if they are not authenticated
        return <div>Error: User not authenticated. Please log in.</div>;
    }

    const email = user.emailAddresses[0]?.emailAddress ?? " ";
    if (!email) {
        console.error("No email found for the user");
        return <div>Error: Missing user email.</div>;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }, // assumes email is unique in your schema
        });

        if (existingUser) {
            // Update the Clerk ID if needed
            await prisma.user.upsert({
                where: { email },
                update: {
                    clerkUserId: user.id,
                    name: user.fullName ?? undefined,
                    imageUrl: user.imageUrl ?? undefined,
                },
                create: {
                    name: user.fullName as string,
                    clerkUserId: user.id,
                    email,
                    imageUrl: user.imageUrl ?? undefined,
                },
            });
        }
    } catch (error) {
        console.error("Error syncing user with database:", error);
        return <div>Error syncing user.</div>
    }

    return <div>{children}</div>;
}
