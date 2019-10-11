import React, { useEffect, useReducer } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createTodo, deleteTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { onCreateTodo } from './graphql/subscriptions';
import { makeStyles } from '@material-ui/core';

import awsconfig from './aws-exports';
import Todo from './components/Todo';

API.configure(awsconfig);

const initialState = {todos:[]};
const reducer = (state, action) =>{
  switch(action.type){
    case 'SCAN':
      return {...state, todos:action.todos}
    case 'DELETE':
      const newTodos = state.todos.filter( todo => {
        return todo.id !== action.id
      })
      return {...state, todos: newTodos } 
    default:
      return state
  }
}

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));



async function createNewTodo() {
  const todo = { name: 'Use AppSync', description: 'Yo'}
  await API.graphql(graphqlOperation(createTodo, { input: todo}))
}

async function deleteItem(id) {
  const todo = { id: id }
  await API.graphql(graphqlOperation(deleteTodo, { input: todo }));
  console.log('todo.id', todo.id);
}

function App() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getData()
  }, [state])

  async function getData() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      dispatch({type:'SCAN', todos: todoData.data.listTodos.items});
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleDelete = (id) => {
    console.log('id', id);
    deleteItem(id);
    dispatch({type:'DELETE', id: id})
  }
 
  return (
    <div className="App">
      {state.todos.map(todo => 
        <Todo 
          key={todo.id} 
          todo={todo} 
          classes={classes}
          handleDelete={handleDelete}
        />)}
    </div>
  );
}

export default App;
/*
<div>
      <button onClick={createNewTodo}>Add Todo</button>
      </div>
      <div>
        {state.todos.map((todo, i) => <p key={todo.id}>{todo.name} : {todo.description}   </p>)}
      </div>


      {todos.map(todo => {
        return <Todo classes={classes} />
      })}
*/