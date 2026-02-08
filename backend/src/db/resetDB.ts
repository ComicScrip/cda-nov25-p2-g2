import { hash } from "argon2";
import { Child } from "../entities/Child";
import { Conversation } from "../entities/Conversation";
import { Group } from "../entities/Group";
import { Message } from "../entities/Message";
import { Planning } from "../entities/Planning";
import { Report } from "../entities/Report";
import { User, UserRole } from "../entities/User";
import db from "./index";

export async function clearDB() {
  const runner = db.createQueryRunner();
  const tableDroppings = db.entityMetadatas.map((entity) =>
    runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`),
  );
  await Promise.all(tableDroppings);
  await db.synchronize();
}

async function main() {
  await db.initialize();
  await clearDB();

  // ============================================
  // 1. CRÉATION DES GROUPES (3 groupes)
  // ============================================
  const groupOrange = await Group.create({
    group_name: "🍊 Groupe Orange",
    capacity_group: 8,
  }).save();

  const groupVert = await Group.create({
    group_name: "🍀 Groupe Vert",
    capacity_group: 10,
  }).save();

  const groupViolet = await Group.create({
    group_name: "🍇 Groupe Violet",
    capacity_group: 6,
  }).save();

  console.log("✅ Groupes créés");

  // ============================================
  // 2. CRÉATION DES USERS
  // ============================================

  // avatars créés avec https://multiavatar.com/
  // 1 Admin/Manager
  // L'admin n'a pas de group_id car il a accès à tous les groupes
  await User.create({
    email: "directrice.delacreche@babyboard.fr",
    hashedPassword: await hash("Password123!"),
    first_name: "Marie",
    last_name: "Lapoigne",
    phone: "06 12 34 56 78",
    role: UserRole.Admin,
    group_id: null, // ✅ NULL car l'admin gère tous les groupes
    avatar: "/avatars/avatar1.png",
  }).save();

  // 4 Staff (2 pour le groupe orange, 1 pour les autres)
  const staffOrange1 = await User.create({
    email: "angele.bisounours@babyboard.fr",
    hashedPassword: await hash("Password123!"),
    first_name: "Angèle",
    last_name: "Bisounours",
    phone: "06 23 45 67 89",
    role: UserRole.Staff,
    group_id: groupOrange.group_id,
    avatar: "/avatars/avatar2.png",
  }).save();

  const staffOrange2 = await User.create({
    email: "julien.calin@babyboard.fr",
    hashedPassword: await hash("Password123!"),
    first_name: "Julien",
    last_name: "Calin",
    phone: "06 78 90 12 34",
    role: UserRole.Staff,
    group_id: groupOrange.group_id,
    avatar: "/avatars/avatar3.png",
  }).save();

  const staffVert = await User.create({
    email: "elsa.cajoline@babyboard.fr",
    hashedPassword: await hash("Password123!"),
    first_name: "Elsa",
    last_name: "Cajoline",
    phone: "06 34 56 78 90",
    role: UserRole.Staff,
    group_id: groupVert.group_id,
    avatar: "/avatars/avatar4.png",
  }).save();

  const staffViolet = await User.create({
    email: "ginette.papouille@babyboard.fr",
    hashedPassword: await hash("Password123!"),
    first_name: "Ginette",
    last_name: "Papouille",
    phone: "06 45 67 89 01",
    role: UserRole.Staff,
    group_id: groupViolet.group_id,
    avatar: "/avatars/avatar5.png",
  }).save();

  // 3 Parents (pas de group_id, ils héritent du groupe de leurs enfants)
  const parent1 = await User.create({
    email: "kevin.dupont@gmail.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Kevin",
    last_name: "Dupont",
    phone: "06 56 78 90 12",
    role: UserRole.Parent,
    group_id: null,
    avatar: "/avatars/avatar6.png",
  }).save();

  const parent2 = await User.create({
    email: "lena.martin@gmail.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Léna",
    last_name: "Martin",
    phone: "06 67 89 01 23",
    role: UserRole.Parent,
    group_id: null,
    avatar: "/avatars/avatar7.png",
  }).save();

  const parent3 = await User.create({
    email: "Isa.rossi@gmail.com",
    hashedPassword: await hash("Password123!"),
    first_name: "Isa",
    last_name: "Rossi",
    phone: "06 67 89 56 78",
    role: UserRole.Parent,
    group_id: null,
    avatar: "/avatars/avatar8.png",
  }).save();

  console.log("✅ Users créés (1 admin, 3 staff, 3 parents)");

  // ============================================
  // 3. CRÉATION DES ENFANTS (4 enfants, dont 2 pour le même parent)
  // ============================================

  // pictures créées avec https://avatars.lunik-creations.fr/
  // Lier les parents à l'enfant (relation ManyToMany)

  const child1 = await Child.create({
    firstName: "Léo",
    lastName: "Dupont",
    birthDate: new Date("2025-03-15"),
    picture: "/pictures/picture1.png",
    healthRecord: "Allergique aux brocolis et au rangement",
    group: groupOrange,
  }).save();

  child1.parents = [parent1];
  await child1.save();

  const child2 = await Child.create({
    firstName: "Chiara",
    lastName: "Martin",
    birthDate: new Date("2024-11-20"),
    picture: "/pictures/picture2.png",
    healthRecord: "Fan de purée de carottes et de siestes marathons",
    group: groupVert,
  }).save();

  child2.parents = [parent2];
  await child2.save();

  const child3 = await Child.create({
    firstName: "Gaby",
    lastName: "Rossi",
    birthDate: new Date("2023-01-10"),
    picture: "/pictures/picture3.png",
    healthRecord: "Passion : manger du sable, collectionner les cailloux",
    group: groupViolet,
  }).save();

  child3.parents = [parent3];
  await child3.save();

  const child4 = await Child.create({
    firstName: "Izia",
    lastName: "Rossi",
    birthDate: new Date("2025-01-10"),
    picture: "/pictures/picture4.png",
    healthRecord: "Toujours de bonne humeur",
    group: groupOrange,
  }).save();

  child4.parents = [parent3];
  await child4.save();

  console.log("✅ Enfants créés");

  // ============================================
  // 4. CRÉATION DES PLANNINGS (6 plannings = 3 groupes × 2 jours)
  // ============================================

  // ===== LUNDI 15 JUIN 2026 =====

  // Planning Lundi - Groupe Orange
  await Planning.create({
    date: new Date("2026-06-15T00:00:00"),
    meal: "Purée de carottes et escalope de poulet",
    morning_nap: "10h00 - 11h30",
    afternoon_nap: "14h00 - 16h00",
    morning_activities: "Atelier peinture avec les doigts (et les murs)",
    afternoon_activities: "Lecture de contes et câlins",
    snack: "Compote de pommes et petit beurre",
    group: groupOrange,
  }).save();

  // Planning Lundi - Groupe Vert
  await Planning.create({
    date: new Date("2026-06-15T00:00:00"),
    meal: "Gratin de courgettes et jambon",
    morning_nap: "9h30 - 11h00",
    afternoon_nap: "13h30 - 15h30",
    morning_activities: "Éveil musical et danse du canard",
    afternoon_activities: "Jeux d'eau dans le jardin",
    snack: "Yaourt nature et morceaux de banane",
    group: groupVert,
  }).save();

  // Planning Lundi - Groupe Violet
  await Planning.create({
    date: new Date("2026-06-15T00:00:00"),
    meal: "Poisson pané et semoule",
    morning_nap: "10h30 - 12h00",
    afternoon_nap: "14h30 - 16h30",
    morning_activities: "Construction de tours en kaplas (destruction incluse)",
    afternoon_activities: "Promenade au parc et chasse aux feuilles",
    snack: "Pain et chocolat (un carré, pas plus !)",
    group: groupViolet,
  }).save();

  // ===== MARDI 16 JUIN 2026 =====

  // Planning Mardi - Groupe Orange
  await Planning.create({
    date: new Date("2026-06-16T00:00:00"),
    meal: "Spaghetti bolognaise (version mini)",
    morning_nap: "10h00 - 11h30",
    afternoon_nap: "14h00 - 16h00",
    morning_activities: "Parcours de motricité et ballons",
    afternoon_activities: "Atelier collage et gommettes",
    snack: "Fromage blanc et biscuits",
    group: groupOrange,
  }).save();

  // Planning Mardi - Groupe Vert
  await Planning.create({
    date: new Date("2026-06-16T00:00:00"),
    meal: "Purée de brocolis et nuggets de poulet",
    morning_nap: "9h30 - 11h00",
    afternoon_nap: "13h30 - 15h30",
    morning_activities: "Jeux libres avec les voitures et circuits",
    afternoon_activities: "Spectacle de marionnettes",
    snack: "Compote de poires et madeleines",
    group: groupVert,
  }).save();

  // Planning Mardi - Groupe Violet
  await Planning.create({
    date: new Date("2026-06-16T00:00:00"),
    meal: "Riz et poisson sauce tomate",
    morning_nap: "10h30 - 12h00",
    afternoon_nap: "14h30 - 16h30",
    morning_activities: "Atelier sensoriel : pâte à modeler",
    afternoon_activities: "Histoires et temps calme",
    snack: "Fruits frais découpés et petits gâteaux",
    group: groupViolet,
  }).save();

  console.log("✅ Plannings créés (6 plannings)");

  // ============================================
  // 5. CRÉATION DES REPORTS (4 reports)
  // ============================================

  const report1 = Report.create({
    isPresent: true,
    date: new Date("2026-06-15"),
    staff_comment:
      "Il a mangé comme un ogre et a fait une sieste de champion ! 😴",
    baby_mood: "Joyeux et joueur",
    picture: "https://picsum.photos/200/300?random=1",
  });
  report1.child = child1;
  await report1.save();

  const report2 = Report.create({
    isPresent: false,
    date: new Date("2026-06-16"),
    staff_comment: "Absente aujourd'hui (rendez-vous chez le pédiatre)",
    baby_mood: "N/A",
    picture: undefined,
  });
  report2.child = child2;
  await report2.save();

  const report3 = Report.create({
    isPresent: true,
    date: new Date("2026-06-17"),
    staff_comment: "Gaby a refusé la purée mais a adoré le dessert.",
    baby_mood: "Capricieuse mais adorable",
    picture: "https://picsum.photos/200/300?random=2",
  });
  report3.child = child3;
  await report3.save();

  console.log("✅ Reports créés");

  const report4 = Report.create({
    isPresent: true,
    date: new Date("2026-06-18"),
    staff_comment:
      "Izia a été adorable toute la journée ! Elle a bien joué avec Léo.",
    baby_mood: "Joyeuse",
    picture: "https://picsum.photos/200/300?random=4",
  });
  report4.child = child4;
  await report4.save();

  // ============================================
  // 6. CRÉATION DES CONVERSATIONS (4 conversations)
  // ============================================

  const conv1 = await Conversation.create({
    initiator: parent1,
    participant: staffOrange1,
  }).save();

  const conv2 = await Conversation.create({
    initiator: parent2,
    participant: staffVert,
  }).save();

  const conv3 = await Conversation.create({
    initiator: staffViolet,
    participant: parent3,
  }).save();

  const conv4 = await Conversation.create({
    initiator: parent3,
    participant: staffOrange2,
  }).save();

  console.log("✅ Conversations créées");

  // ============================================
  // 7. CRÉATION DES MESSAGES (8 messages)
  // ============================================

  await Message.create({
    content: "Bonjour ! Est-ce que Léo a bien mangé ce midi ? 😊",
    author: parent1,
    conversation: conv1,
  }).save();

  await Message.create({
    content:
      "Bonjour ! Oui, il a tout dévoré ! Il a même redemandé de la purée 😄",
    author: staffOrange1,
    conversation: conv1,
  }).save();

  await Message.create({
    content: "Coucou ! Vous savez si la crèche est ouverte le 14 juillet ?",
    author: parent2,
    conversation: conv2,
  }).save();

  await Message.create({
    content:
      "Non, elle est fermée ce jour-là. Par contre, elle est ouverte le 15 😉",
    author: staffVert,
    conversation: conv2,
  }).save();

  await Message.create({
    content:
      "Bonjour, votre enfant a de la fièvre, il faudrait nous rappeler. Nous n'arrivons pas à vous joindre.",
    author: staffViolet,
    conversation: conv3,
  }).save();

  await Message.create({
    content: "OK, je vous rappelle dans 5 minutes.",
    author: parent3,
    conversation: conv3,
  }).save();

  await Message.create({
    content: "Bonjour Angèle ! Comment va Izia aujourd'hui ?",
    author: parent3,
    conversation: conv4,
  }).save();

  await Message.create({
    content:
      "Bonjour Isa ! Izia va très bien, elle s'amuse beaucoup avec Léo 😊",
    author: staffOrange2,
    conversation: conv4,
  }).save();

  console.log("✅ Messages créés");

  await db.destroy();
  console.log("🎉 Base de données réinitialisée avec succès !");
}

main();
