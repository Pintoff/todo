<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <h2>Вы уверены, что хотите удалить эту задачу?</h2>
      <aside>
        <button @click="cancel">Нет</button>
        <button @click="confirm">Да</button>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    todoId: Number,
  },
  setup(props, { emit }) {
    const confirm = () => {
      emit("confirm");
    };
    const cancel = () => {
      emit("close");
    };
    return {
      confirm,
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
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}
</style>
