// listTodos.js
const db = require("./models/index");

const todoShowList = async () => {
  try {
    await db.Todo.showList();
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await todoShowList();
})();
