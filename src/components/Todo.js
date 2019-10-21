import React from 'react';
import {
  Card, CardActions, CardContent, Typography, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';

function Todo({ classes, todo, handleDelete }) {
  return (
    <Card
      className={classes.card}
      raised
    >
      <CardContent>
        <Typography gutterBottom>
          {todo.name}
        </Typography>
        <Typography variant='body2' component='p'>
          {todo.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button color='secondary' onClick={() => handleDelete(todo.id)} size='small' className={classes.button}>Done</Button>
      </CardActions>
    </Card>
  );
}

export default Todo;

Todo.propTypes = {
  classes: PropTypes.object,
  todo: PropTypes.object,
  handleDelete: PropTypes.func,
};
