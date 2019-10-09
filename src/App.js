import React, { useEffect, useReducer } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { onCreateTodo } from './graphql/subscriptions';
import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import awsconfig from './aws-exports';

API.configure(awsconfig);
Amplify.configure(awsconfig);

Amplify.configure({
    Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'eu-west-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-1_BLiQe2HTM',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '50vte5k4orevnh6bc95acpd825',
    
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
  }
});

const currentConfig = Auth.configure();



async function SignIn(username, password) {
  try {
      const user = await Auth.signIn(username, password);
      console.log('user', user);
      
  } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
          // The error happens if the user didn't finish the confirmation step when signing up
          // In this case you need to resend the code and confirm the user
          // About how to resend the code and confirm the user, please check the signUp part
      } else if (err.code === 'PasswordResetRequiredException') {
          // The error happens when the password is reset in the Cognito console
          // In this case you need to call forgotPassword to reset the password
          // Please check the Forgot Password part.
      } else if (err.code === 'NotAuthorizedException') {
          // The error happens when the incorrect password is provided
      } else if (err.code === 'UserNotFoundException') {
          // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
          console.log(err);
      }
  }
}


const initialState = { todos: [] };
const reducer = (state, action) => {
  switch(action.type){
    case 'QUERY':
      return { ...state, todos: action.todos }
    case 'SUBSCRIPTION':
      return { ...state, todos: [...state.todos, action.todo] }
    default:
      return state
  }
}

async function createNewTodo() {
  const todo = { name: 'Use AppSync', description: 'Yo'}
  await API.graphql(graphqlOperation(createTodo, { input: todo}))
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
   useEffect(() => {
     getData();
     const subscription = API.graphql(graphqlOperation(onCreateTodo))
     .subscribe({
       next: (eventData) => {
         const todo = eventData.value.data.onCreateTodo;
         dispatch({type:'SUBSCRIPTION', todo})
       }
     })
     return () => subscription.unsubscribe()
   }, []);

  
  console.log('currentConfig', currentConfig);
  
  SignIn('fejop@getnada.com', 'fejo1234');

  async function getData() {
    const todoData = await API.graphql(graphqlOperation(listTodos));
    dispatch({type:'QUERY', todos: todoData.data.listTodos.items});
  } 
  return (
    <div className="App">
      <div>
      <button onClick={createNewTodo}>Add Todo</button>
      </div>
      <div>
        {state.todos.map((todo, i) => <p key={todo.id}>{todo.name} : {todo.description}   </p>)}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
