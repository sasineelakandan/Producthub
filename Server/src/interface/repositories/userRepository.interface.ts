

export interface IUserRepository {
  
  getUserByEmail(email: string,password:string) : Promise<any>;
}
