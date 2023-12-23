import Realm, { Results } from "realm";
import { Schema } from "../../typings/types";
import RealmService from "./realmService";
import { fetchExercises } from "./exercise";

export class RealmWrapper {
  private realm: Realm;

  constructor() {
    const realmService = RealmService.getInstance();
    this.realm = realmService.getRealm();
  }

  getMaxId<T extends Schema[keyof Schema]>(objectType: keyof Schema): number {
    const maxId = (this.realm.objects<T>(objectType as string).max("id") as number) + 1;
    return maxId || 1;
  }


  async getRealmObject<T extends Schema[keyof Schema]>(schemaName: keyof Schema, limitBy?: { by: 'Month' | "Week" | "Year", when: number }) {
    if (schemaName === "Exercise" && limitBy && limitBy.by === "Year") {
      const exercises = fetchExercises({by: 'Year', when: [limitBy.when]})
      return exercises;
    }
    if (limitBy && limitBy.by === "Month") {
      const month = limitBy.when;
      const year = new Date().getFullYear(); // or use a specific year if needed
      const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const endDate = new Date(year, month + 1, 1);
      return Array.from(this.realm.objects<T>(schemaName).filtered("date >= $0 AND date < $1", startDate, endDate));
    }
    return Array.from(this.realm.objects<T>(schemaName))
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
