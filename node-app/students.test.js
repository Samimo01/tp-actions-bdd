const {
  getConnection,
  addStudent,
  getStudent,
  averageGrade,
} = require("./students");

let client;

beforeAll(async () => {
  client = await getConnection();
});

beforeEach(async () => {
  // table vidée avant chaque test
  await client.query("TRUNCATE students RESTART IDENTITY");
});

afterAll(async () => {
  await client.end();
});

test("ajout et lecture", async () => {
  const id = await addStudent(client, "Samy", 16);
  const student = await getStudent(client, id);

  expect(student.name).toBe("Samy");
  expect(student.grade).toBe(16);
});

test("étudiant inexistant", async () => {
  expect(await getStudent(client, 9999)).toBeNull();
});

test("moyenne", async () => {
  await addStudent(client, "Amel", 10);
  await addStudent(client, "Karim", 14);

  expect(await averageGrade(client)).toBe(12);
});
