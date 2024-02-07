const db = require("../models");

const calculateDueDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("An integer value representing days is required");
  }
  const today = new Date();
  const millisecondsInADay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * millisecondsInADay);
};

describe("Tests for functions in todo.js", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Todo.overdue should retrieve all tasks, including completed ones, that are past their due date", async () => {
    const task = await db.Todo.addTask({
      title: "Sample Task",
      dueDate: calculateDueDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Todo.dueToday should retrieve all tasks, including completed ones, due today", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const task = await db.Todo.addTask({
      title: "Sample Task",
      dueDate: calculateDueDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Todo.dueLater should retrieve all tasks, including completed ones, due on a future date", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const task = await db.Todo.addTask({
      title: "Sample Task",
      dueDate: calculateDueDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Todo.markAsComplete should update the 'completed' property of a task to true", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTask = overdueItems[0];
    expect(aTask.completed).toBe(false);
    await db.Todo.markAsComplete(aTask.id);
    await aTask.reload();

    expect(aTask.completed).toBe(true);
  });

  test("For a completed past-due task, Todo.displayableString should return a specific format", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTask = overdueItems[0];
    expect(aTask.completed).toBe(true);
    const displayValue = aTask.displayableString();
    expect(displayValue).toBe(
      `${aTask.id}. [x] ${aTask.title} ${aTask.dueDate}`
    );
  });

  test("For an incomplete task in the future, Todo.displayableString should return a specific format", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const aTask = dueLaterItems[0];
    expect(aTask.completed).toBe(false);
    const displayValue = aTask.displayableString();
    expect(displayValue).toBe(
      `${aTask.id}. [ ] ${aTask.title} ${aTask.dueDate}`
    );
  });

  test("For an incomplete task due today, Todo.displayableString should return a specific format", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const aTask = dueTodayItems[0];
    expect(aTask.completed).toBe(false);
    const displayValue = aTask.displayableString();
    expect(displayValue).toBe(`${aTask.id}. [ ] ${aTask.title}`);
  });

  test("For a complete task due today, Todo.displayableString should return a specific format", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const aTask = dueTodayItems[0];
    expect(aTask.completed).toBe(false);
    await db.Todo.markAsComplete(aTask.id);
    await aTask.reload();
    const displayValue = aTask.displayableString();
    expect(displayValue).toBe(`${aTask.id}. [x] ${aTask.title}`);
  });
});
