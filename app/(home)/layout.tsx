import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();

    if (!user) return <>{children}</>;


    const email = user.emailAddresses[0]?.emailAddress ?? "";
    if (!email) {
        console.error("No email found for the user");
        return <div>Error: Missing user email.</div>;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            await prisma.user.update({
                where: { email },
                data: {
                    clerkUserId: user.id,
                    name: user.fullName ?? undefined,
                    imageUrl: user.imageUrl ?? undefined,
                },
            });
        } else {
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
        return <div>Error syncing user.</div>;
    }

    return <div>{children}</div>;
}
