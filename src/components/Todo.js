import React from 'react';
import { Card, CardActions, CardContent, Typography, Button} from '@material-ui/core';

function Todo({ classes, todo, handleDelete }) {

  return (
    <Card className={classes.card}>
      <CardContent >
        <Typography gutterBottom>
          {todo.name}
        </Typography>
        <Typography variant="body2" component="p">
          {todo.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleDelete(todo.id)} size="small">Delete</Button>
      </CardActions>
    </Card>
  );
}

export default Todo;