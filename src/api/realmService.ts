// RealmService.ts
import Realm from "realm";
import realmConfig, { ExerciseSchema } from "../config/realm";
import {initializeDB} from "../initializeDB";

class RealmService {
  private static instance: RealmService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm(realmConfig);
    initializeDB(this.realm);
   
  }

  public static getInstance(): RealmService {
    if (!RealmService.instance) {
      RealmService.instance = new RealmService();
    }
    return RealmService.instance;
  }

  public getRealm(): Realm {
    return this.realm;
  }
  
}

export default RealmService;
