import React, { useEffect, useReducer, useState } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createTodo, deleteTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import AlertDialog from './components/AlertDialog';
import awsconfig from './aws-exports';
import Todo from './components/Todo';
import AddTodo from './components/AddTodo';

API.configure(awsconfig);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    width: 400,
    margin: 10,
  },
  textField: {
    width: 400,
  },
}));

const initialState = { todos: [] };

const reducer = (state, action) => {
  let newTodos = [];
  switch (action.type) {
    case 'SCAN':
      return { ...state, todos: action.todos };
    case 'DELETE':
      newTodos = state.todos.filter((todo) => todo.id !== action.id);
      return { ...state, todos: newTodos };
    case 'ADD':
      newTodos = [...state.todos, action.todo];
      return { ...state, todos: newTodos };
    default:
      return state;
  }
};

async function createNewTodo(newTodo) {
  try {
    await API.graphql(graphqlOperation(createTodo, { input: newTodo }));
  } catch (err) { }
}

async function deleteItem(id) {
  const todo = { id };
  await API.graphql(graphqlOperation(deleteTodo, { input: todo }));
}

function App() {
  const classes = useStyles();
  const [todo, setTodo] = useState({
    name: '',
    description: '',
  });
  const [state, dispatch] = useReducer(reducer, initialState);
  const [open, setOpen] = React.useState(false);

  async function getData() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      dispatch({ type: 'SCAN', todos: todoData.data.listTodos.items });
    } catch (err) { }
  }

  useEffect(() => {
    getData();
  }, [state]);

  const handleAddTodo = () => {
    createNewTodo(todo);
    dispatch({ type: 'ADD', todo });
    setTodo({
      name: '',
      description: '',
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    deleteItem(id);
    dispatch({ type: 'DELETE', id });
  };
  return (
    <Grid container direction='column' justify='center' alignItems='center'>
      <AlertDialog open={open} setOpen={setOpen} />
      <AddTodo
        todo={todo}
        setTodo={setTodo}
        handleAddTodo={handleAddTodo}
        classes={classes}
      />
      {state.todos.map((todoItem) => (
        <Todo
          key={todoItem.id}
          todo={todoItem}
          classes={classes}
          handleDelete={handleDelete}
        />
      ))}
    </Grid>
  );
}

export default App;
