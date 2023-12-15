const todoList = () => {
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  const todayDate = new Date();
  const today = formattedDate(todayDate);
  const yesterday = formattedDate(
    new Date(new Date().setDate(todayDate.getDate() - 1)),
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(todayDate.getDate() + 1)),
  );

  let all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };

  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const temp = all;
    return temp.filter((item) => item.dueDate === yesterday);
  };

  const dueToday = () => {
    const temp = all;
    return temp.filter((item) => item.dueDate === today);
  };

  const dueLater = () => {
    const temp = all;
    return temp.filter((item) => item.dueDate === tomorrow);
  };

  const toDisplayableList = (list) => {
    let retStr = "";
    let dueState = list[0].dueDate;
    list.forEach((item) => {
      if (item.dueDate === dueState)
        retStr += `${item.completed ? "[x]" : "[ ]"} ${item.title} ${
          item.dueDate === today ? "" : item.dueDate
        }\n`;
    });
    retStr = retStr.slice(0, -1);
    return retStr;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
