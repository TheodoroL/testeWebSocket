export type UsersTable = {
    id: number,
    nome: string,
    senha: string
}

export type ChatDatabase = {
    users: UsersTable[]
}