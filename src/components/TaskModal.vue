<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <h2>{{ isEditing ? "Редактировать задачу" : "Создать новую задачу" }}</h2>
      <label for="task-name">Введите название:</label>
      <input v-model="taskName" id="task-name" type="text" />
      <div
        v-for="(subtask, index) in subtasks"
        :key="index"
        class="subtask-item"
      >
        <label :for="'subtask-' + index"> {{ index + 1 }}:</label>
        <input v-model="subtasks[index]" :id="'subtask-' + index" type="text" />
      </div>

      <button @click="addSubtask">Добавить подзадачу</button>
      <aside>
        <button @click="cancel">Отмена</button>
        <button type="submit" @click="saveTask">
          {{ isEditing ? "Сохранить" : "Добавить" }}
        </button>
      </aside>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useTodoStore } from "./stores/todoStore";

export default {
  props: {
    isOpen: Boolean,
    todo: Object,
  },
  setup(props, { emit }) {
    const taskName = ref("");
    const subtasks = ref([""]);
    const isEditing = ref(false);
    const todoStore = useTodoStore();

    watch(
      () => props.todo,
      (newTodo) => {
        if (newTodo) {
          isEditing.value = true;
          taskName.value = newTodo.text;
          subtasks.value = newTodo.subtasks.map((subtask) => subtask.text);
        } else {
          isEditing.value = false;
          taskName.value = "";
          subtasks.value = [""];
        }
      },
      { immediate: true },
    );

    const addSubtask = () => {
      subtasks.value.push("");
    };

    const saveTask = () => {
      if (taskName.value.trim() !== "") {
        if (isEditing.value) {
          todoStore.editTodo(props.todo.id, taskName.value);
          subtasks.value.forEach((subtask, index) => {
            if (subtask.trim() !== "") {
              if (index < props.todo.subtasks.length) {
                todoStore.editSubtask(
                  props.todo.id,
                  props.todo.subtasks[index].id,
                  subtask,
                );
              } else {
                todoStore.addSubtask(props.todo.id, subtask);
              }
            }
          });
        } else {
          todoStore.addTodo(taskName.value);
          subtasks.value.forEach((subtask) => {
            if (subtask.trim() !== "") {
              todoStore.addSubtask(
                todoStore.todos[todoStore.todos.length - 1].id,
                subtask,
              );
            }
          });
        }
        emit("close");
      }
    };

    const cancel = () => {
      emit("close");
    };

    return {
      taskName,
      subtasks,
      isEditing,
      addSubtask,
      saveTask,
      cancel,
    };
  },
};
</script>

<style scoped>
aside {
  margin-top: 1vh;
  display: flex;
  align-items: center;
  width: inherit;
  justify-content: space-between;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.6);
  animation: overlayFade 0.3s ease-in-out;
}

.subtask-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.subtask-item input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 5px;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

button {
  background: linear-gradient(45deg, #59cc9e, #04a732);
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

button:hover {
  background: linear-gradient(45deg, #296f53, #04e343);
}

input {
  width: -webkit-fill-available;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes overlayFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
