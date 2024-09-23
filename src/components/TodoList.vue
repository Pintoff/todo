<template>
    <div class="todo">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Добавить новое задание"
        class="todo__input"
      />
      <button class="modal__save-btn todo__add-btn" @click="addTodo">
        Добавить
      </button>
      <ul class="todo__list">
        <li v-for="todo in todoStore.todos" :key="todo.id" class="todo__item">
          <input
            v-model="todo.text"
            @blur="editTodo(todo.id, todo.text)"
            class="todo__text"
          />
          <p class="todo__description">
            {{ truncatedDescription(todo) }}
            <span v-if="todo.description.length > MAX_CHARS">
              <button
                @click="toggleDescription(todo.id)"
                class="todo__default-btn"
              >
                {{ expandedTodos.includes(todo.id) ? "Скрыть" : "Раскрыть" }}
              </button>
            </span>
          </p>
          <aside class="todo__buttons">
            <button @click="openModal(todo)" class="todo__default-btn">
              Редактировать описание
            </button>
            <button @click="deleteTodo(todo.id)" class="todo__delete-btn">
              Выполнено!
            </button>
          </aside>
        </li>
      </ul>
      <div v-if="isModalOpen" class="modal">
        <div class="modal__content">
          <h2>Редактирование описания</h2>
          <textarea
            v-model="selectedTodoDescription"
            class="modal__textarea"
          ></textarea>
          <aside class="todo__buttons">
            <button @click="saveDescription" class="modal__save-btn">
              Сохранить
            </button>
            <button @click="closeModal" class="modal__close-btn">Закрыть</button>
          </aside>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useTodoStore } from "../components/stores/todoStore";
  import { Todo } from "../components/stores/todoStore";
  
  const MAX_CHARS = 25;
  const todoStore = useTodoStore();
  const newTodo = ref<string>("");
  const isModalOpen = ref<boolean>(false);
  const selectedTodo = ref<Todo | null>(null);
  const selectedTodoDescription = ref<string>("");
  const expandedTodos = ref<number[]>([]);
  
  todoStore.loadTodos();
  
  const openModal = (todo: Todo) => {
    selectedTodo.value = todo;
    selectedTodoDescription.value = todo.description;
    isModalOpen.value = true;
  };
  
  const saveDescription = () => {
    if (selectedTodo.value) {
      todoStore.editDescription(
        selectedTodo.value.id,
        selectedTodoDescription.value,
      );
    }
    closeModal();
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
  };
  
  const addTodo = () => {
    if (newTodo.value.trim()) {
      todoStore.addTodo(newTodo.value);
      newTodo.value = "";
    }
  };
  
  const deleteTodo = (id: number) => {
    todoStore.deleteTodo(id);
  };
  
  const editTodo = (id: number, newText: string) => {
    todoStore.editTodo(id, newText);
  };
  
  const truncatedDescription = (todo: Todo) => {
    if (expandedTodos.value.includes(todo.id)) {
      return todo.description;
    }
    return todo.description.length > MAX_CHARS
      ? todo.description.slice(0, MAX_CHARS) + "..."
      : todo.description;
  };
  
  const toggleDescription = (id: number) => {
    const index = expandedTodos.value.indexOf(id);
    if (index === -1) {
      expandedTodos.value.push(id);
    } else {
      expandedTodos.value.splice(index, 1);
    }
  };
  </script>
  
  <style scoped>
  .todo {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .todo__add-btn {
    margin-top: 1vh;
    margin-bottom: 1vh;
  }
  
  .todo__default-btn {
    background-color: rgba(51, 51, 51, 0.05);
    border-radius: 8px;
    border-width: 0;
    color: #333333;
    cursor: pointer;
    display: inline-block;
    font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    margin: 0;
    padding: 10px 12px;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }
  
  .todo__input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  .todo__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .todo__buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: -webkit-fill-available;
  }
  
  .todo__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .todo__text {
    flex-grow: 1;
    border: none;
    font-size: 16px;
    padding: 5px;
    background-color: transparent;
    color: #333;
  }
  
  .todo__text:focus {
    outline: none;
    background-color: #f0f0f0;
  }
  
  .todo__description {
    width: 100%;
    word-wrap: break-word;
    overflow: hidden;
    white-space: pre-wrap;
  }
  
  .todo__edit-description-btn {
    margin: 1vh;
  }
  
  .todo__delete-btn {
    background-color: #ff4d4f;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-left: 10px;
  }
  
  .todo__delete-btn:hover {
    background-color: #ff7875;
  }
  
  @media (max-width: 400px) {
    .todo {
      padding: 15px;
    }
  
    .todo__item {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .todo__text {
      margin-bottom: 10px;
      width: 100%;
    }
  
    .todo__delete-btn {
      width: 100%;
    }
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal__content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .modal__textarea {
    width: 95%;
    height: 100px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .modal__save-btn,
  .modal__close-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .modal__save-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .modal__close-btn {
    background-color: #f44336;
    color: white;
  }
  </style>
  