import { prisma } from "../prisma"

export const fetchArticleByQuery = async (searchText: string, skip: number, take: number) => {

    const [articles, total] = await prisma.$transaction([
        prisma.article.findMany({
            where: {
                OR: [
                    { title: { contains: searchText, mode: 'insensitive' } },
                    { category: { contains: searchText, mode: 'insensitive' } }
                ]
            },
            include: {
                author: {
                    select: {
                        name: true,
                        imageUrl: true,
                        email: true
                    }
                }
            },
            skip:skip,
            take:take,

        }),
        prisma.article.count({
            where: {
                OR: [
                    { title: { contains: searchText, mode: 'insensitive' } },
                    { category: { contains: searchText, mode: 'insensitive' } }
                ]
            }
        })
    ])

    return {articles, total};
}