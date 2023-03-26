// RealmService.ts
import Realm from "realm";
import realmConfig from "../config/realmConfig";

class RealmService {
  private static instance: RealmService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm(realmConfig);
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
