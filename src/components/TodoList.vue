<template>
  <WaweButton @click="openModal">Создать новую задачу </WaweButton>
  <div class="todo-list">
    <article
      class="todo"
      @click="openEditModal(todo)"
      @mouseover="showDeleteIcon(todo.id)"
      @mouseleave="hideDeleteIcon(todo.id)"
      @focus="showDeleteIcon(todo.id)"
      tabindex="0"
      @keydown.space="openEditModal(todo)"
      v-for="todo in todoStore.todos"
    >
      <header>
        <div class="img-wrap">
          <svg height="200" width="200" xmlns="http://www.w3.org/2000/svg">
            <circle r="8" cx="25" cy="25" :fill="todo.color" />
          </svg>
        </div>
        <h2>{{ todo.text }}</h2>
        <span
          tabindex="0"
          @keydown.space="openDeleteModal(todo.id)"
          v-if="deleteIconVisible === todo.id"
          class="delete-icon"
          @click="openDeleteModal(todo.id)"
          >×</span
        >
      </header>
      <SubtaskList :subtasks="todo.subtasks" />
    </article>
  </div>

  <TaskModal :isOpen="isModalOpen" :todo="selectedTodo" @close="closeModal" />
  <DeleteModal
    :isOpen="isDeleteModalOpen"
    :todoId="todoIdToDelete"
    @close="closeDeleteModal"
    @confirm="confirmDelete"
  />
</template>

<script setup>
import { useTodoStore } from "./stores/todoStore";
import SubtaskList from "./SubtaskList.vue";
import WaweButton from "./ui/WaweButton.vue";
import TaskModal from "./TaskModal.vue";
import DeleteModal from "./DeleteModal.vue";
import { ref, onMounted } from "vue";
const isDeleteModalOpen = ref(false);
const deleteIconVisible = ref(null);
const todoIdToDelete = ref(null);
const isModalOpen = ref(false);
const selectedTodo = ref(null);

const openEditModal = (todo) => {
  selectedTodo.value = todo;
  isModalOpen.value = true;
};

const openModal = () => {
  selectedTodo.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const showDeleteIcon = (id) => {
  deleteIconVisible.value = id;
};

const hideDeleteIcon = () => {
  deleteIconVisible.value = null;
};

const openDeleteModal = (id) => {
  event.stopPropagation();
  todoIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  todoIdToDelete.value = null;
};

const confirmDelete = () => {
  todoStore.deleteTodo(todoIdToDelete.value);
  closeDeleteModal();
};

const todoStore = useTodoStore();
todoStore.loadTodos();

const toggleSubtask = (todoId, subtaskId) => {
  const todo = todos.value.find((t) => t.id === todoId);
  if (todo) {
    const subtask = todo.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
    }
  }
};
</script>

<style>
header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: -webkit-fill-available;
}

li {
  list-style: none;
  margin-bottom: 2vh;
}

h2,
h3 {
  display: inline;
}

article {
  height: min-content;
}

article:hover {
  transform: scale(1.01);
}

header span {
  font-size: 3rem;
}

.img-wrap {
  width: 50px;
  height: 50px;
}

.todo-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  list-style: none;
  padding: 0;
}

.todo {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.todo:focus {
  border: 2px solid black;
}

.form-control {
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.1;
  display: grid;
  grid-template-columns: 1em auto;
  gap: 0.5em;
}

.form-control + .form-control {
  margin-top: 1em;
}

.form-control--disabled {
  color: var(--form-control-disabled);
  cursor: not-allowed;
}

input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--form-background);
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  transform: scale(0);
  transform-origin: bottom left;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--form-control-color);
  background-color: CanvasText;
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

input[type="checkbox"]:focus {
  outline: max(2px, 0.15em) solid currentColor;
  outline-offset: max(2px, 0.15em);
}

input[type="checkbox"]:disabled {
  --form-control-color: var(--form-control-disabled);
  color: var(--form-control-disabled);
  cursor: not-allowed;
}

.delete-icon {
  position: absolute;
  cursor: pointer;
  color: red;
  margin-left: 10px;
  right: 0;
  top: 0;
}

.todo:hover .delete-icon {
  display: inline;
}

@media (max-width: 768px) {
  .todo-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .todo-list {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .todo {
    padding: 15px;
  }
}
</style>
