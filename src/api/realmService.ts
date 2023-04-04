// RealmService.ts
import Realm from "realm";
import realmConfig from "../config/realmConfig";

class RealmService {
  private static instance: RealmService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm(realmConfig);
    if (this.realm.objects("Exercise").length === 0) {
      this.realm.write(() => {
        this.realm.create("Exercise", {
weight: 10,
          id: 1,
          name: "Pushups",
          sets: 3,
          reps: 10,
          date: new Date("2023-03-19"),
          category: "Arms",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 2,
          name: "Squats",
          sets: 4,
          reps: 8,
          date: new Date("2023-03-19"),
          category: "Legs",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 3,
          name: "Bicep Curls",
          sets: 3,
          reps: 10,
          date: new Date("2023-03-19"),
          category: "Arms",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 4,
          name: "Shoulder Press",
          sets: 3,
          reps: 12,
          date: new Date("2023-03-21"),
          category: "Shoulders",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 5,
          name: "Lunges",
          sets: 3,
          reps: 10,
          date: new Date("2023-03-21"),
          category: "Legs",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 6,
          name: "Tricep Extensions",
          sets: 3,
          reps: 12,
          date: new Date("2023-03-21"),
          category: "Arms",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 7,
          name: "Bench Press",
          sets: 4,
          reps: 8,
          date: new Date("2023-03-23"),
          category: "Chest",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 8,
          name: "Deadlifts",
          sets: 3,
          reps: 6,
          date: new Date("2023-03-23"),
          category: "Legs",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 9,
          name: "Military Press",
          sets: 3,
          reps: 10,
          date: new Date("2023-03-23"),
          category: "Shoulders",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 10,
          name: "Pull-ups",
          sets: 3,
          reps: 10,
          date: new Date("2023-03-25"),
          category: "Back",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 11,
          name: "Leg Curls",
          sets: 4,
          reps: 8,
          date: new Date("2023-03-25"),
          category: "Legs",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 12,
          name: "Bench Dips",
          sets: 3,
          reps: 12,
          date: new Date("2023-03-25"),
          category: "Arms",
        });
        this.realm.create("Exercise", {
weight: 10,
          id: 13,
          name: "Chest Flyes",
          sets: 3,
          reps: 10,
          date: new Date("2023-03-27"),
          category: "Chest",
        });
      });
    }
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
