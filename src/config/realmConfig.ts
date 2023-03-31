// realmConfig.ts
import Realm from "realm";

export class ExerciseSchema extends Realm.Object {
  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: "int",
      name: "string",
      sets: "int",
      reps: "int",
      date: "date",
      category: "string",
    },
  };

  id!: number;
  name!: string;
  sets!: number;
  reps!: number;
  date!: Date;
  category!: string;
}

const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema],
  schemaVersion: 2,
  onMigration: migration,
};

function migration(oldRealm: Realm, newRealm: Realm) {
  return
}

export default realmConfig;