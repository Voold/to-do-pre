const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

const STORAGE_KEY = "todoTasks";

const DEFAULT_ITEMS = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

function loadTasks() {

  const savedTasks = localStorage.getItem(STORAGE_KEY);
  const tasks = savedTasks ? JSON.parse(savedTasks) : DEFAULT_ITEMS;

  for (let i = tasks.length - 1; i >= 0; i--) {

    const itemElement = createItem(tasks[i]);
		
    if (listElement.firstChild) {
      listElement.insertBefore(itemElement, listElement.firstChild);
    } else {
      listElement.appendChild(itemElement);
    }

  }

}

function createItem(item) {

  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);

  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {

    clone.remove();
    saveTasks(getTasksFromDOM());

  });

  duplicateButton.addEventListener("click", () => {

    const currentItemText = textElement.textContent.trim(); 
    const newItem = createItem(currentItemText);

    if (listElement.firstChild) {
      listElement.insertBefore(newItem, listElement.firstChild);
    } else {
      listElement.appendChild(newItem);
    }

    saveTasks(getTasksFromDOM());

  });

  editButton.addEventListener("click", () => {

    textElement.contentEditable = "true";
    textElement.focus();

    textElement.addEventListener("blur", () => {

      const newText = textElement.textContent.trim();

      if (newText) {
        saveTasks(getTasksFromDOM());
      } else {
        textElement.textContent = item;
      }

			textElement.contentEditable = "false";

    }, { once: true });
  });

  return clone;
}

function getTasksFromDOM() {

  const taskElements = listElement.querySelectorAll(".to-do__item-text");
  return Array.from(taskElements).map(el => el.textContent);

}

function saveTasks(tasks) {

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

}

formElement.addEventListener("submit", (e) => {

  e.preventDefault();

  const newTaskText = inputElement.value.trim();

  if (newTaskText) {
    const newItem = createItem(newTaskText);

    if (listElement.firstChild) {
      listElement.insertBefore(newItem, listElement.firstChild);
    } else {
      listElement.appendChild(newItem);
    }

    inputElement.value = "";
    saveTasks(getTasksFromDOM());
  }

});

loadTasks();
