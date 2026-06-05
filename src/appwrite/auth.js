import config from "../config/config";
import {Client , Account ,ID} from "appwrite";

export class AuthService{
    client = new Client();
    account;
    constructor(){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account=new Account(this.client)
    }

    async createAccount({eamil,password,name}){
        try {
            const userAccount = await this.account.create(ID.unique(),eamil,password,name);
            if(userAccount){
               // call another method 
               return this.login({eamil,password})
            }else{
                return userAccount
            }
        } catch (error) {
         throw error;   
        }
    }

    async login({eamil,password}){
        try{
           return await this.account.createEmailPasswordSession(eamil,password);
        }catch(error){
           throw error;
        }
    }

    async getCurrentUser(){
        try {
          return await this.account.get()
        } catch (error) {
           console.log("Appwrite service :: getCurrentUser :: error",error)
        }
        return null;
    }

    async logOut(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error",error)
        }
    }
}
   
const authService = new AuthService();

export default authService;