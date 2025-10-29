export interface TodoItem {
  text: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoMVCSelectors {
  newTodoInput: string;
  todoList: string;
  todoItem: string;
  todoToggle: string;
  todoLabel: string;
  todoDestroy: string;
  todoCount: string;
  clearCompleted: string;
  filters: {
    all: string;
    active: string;
    completed: string;
  };
}
