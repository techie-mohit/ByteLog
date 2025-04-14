import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }, // assumes email is unique in your schema
        });

        if (existingUser) {
            // Update the Clerk ID if needed
            await prisma.user.update({
                where: { email },
                data: {
                    clerkUserId: user.id,
                    name: user.fullName ?? undefined,
                    imageUrl: user.imageUrl ?? undefined,
                },
            });
        } else {
            // Create a new user
            await prisma.user.create({
                data: {
                    name: user.fullName as string,
                    clerkUserId: user.id,
                    email,
                    imageUrl: user.imageUrl ?? undefined,
                },
            });
        }
    } catch (error) {
        console.error("Error syncing user with database:", error);
    }

    return <div>{children}</div>;
}
