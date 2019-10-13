export interface UserDao {
    createUser(user:any,uid:any): Promise<any>;
    getUserById(email:string): Promise<any>;
    UserById(id:string): Promise<any>;
    getUser(userId:any): Promise<any>;
    getUserByEmail(email:string): Promise<any>;
    deleteUser(userId: any): Promise<any>;
    saveToken(userId: any, token:any): Promise<any>;
    deleteToken(userId: any): Promise<any>;
    getUsers(discard:number, total_page:number, complements?: any | ''): Promise<any>;
    getUserByIngenioId(ingenioId:string): Promise<any>;
    getUserByRol(): Promise<any>;
    getByRol(rol:string): Promise<any>;
    getByRolandIngenioId(rol:string,ingenioId:number): Promise<any>
}
