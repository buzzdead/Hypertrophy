import Realm from "realm";
import RealmService from "./realmService";

export class RealmWrapper {
  private realm: Realm;

  constructor() {
    const realmService = RealmService.getInstance();
    this.realm = realmService.getRealm();
  }

  getMaxId<T>(objectType: string): number {
    const maxId = (this.realm.objects<T>(objectType).max("id") as number) + 1;
    return maxId || 1;
  }

  getRealm() {
    return this.realm
  }

  async performWriteTransaction(callback: () => void) {
    try {
      this.realm.write(callback);
    } catch (error) {
      console.error("An error occurred during a write transaction:", error);
      throw error;
    }
  }
}
