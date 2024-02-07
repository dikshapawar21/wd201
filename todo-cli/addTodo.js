/* eslint-disable no-undef */
// addTask.js
var args = require("minimist")(process.argv.slice(2));
const database = require("./models/index");

const createTask = async (params) => {
  try {
    await database.Todo.addTask(params);
  } catch (error) {
    console.error(error);
  }
};

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

(async () => {
  const { taskTitle, dueInDays } = args;
  if (!taskTitle || dueInDays === undefined) {
    throw new Error(
      'taskTitle and dueInDays are required. \nSample command: node addTask.js --taskTitle="Buy milk" --dueInDays=-2 ',
    );
  }
  await createTask({ title: taskTitle, dueDate: getJSDate(parseInt(dueInDays)), completed: false });
  await database.Todo.showList();
})();
