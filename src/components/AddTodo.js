import React from 'react';
import { Button, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';


function AddTodo({
  classes, setTodo, handleAddTodo, todo,
}) {
  const handleChange = (item) => (event) => {
    setTodo({ ...todo, [item]: event.target.value });
  };

  return (
    <form>
      <TextField
        className={classes.textField}
        label='Name'
        value={todo.name}
        onChange={handleChange('name')}
        margin='normal'
        variant='outlined'
        fullWidth
      />
      <br />
      <TextField
        className={classes.textField}
        multiline
        rows='4'
        label='Description'
        value={todo.description}
        onChange={handleChange('description')}
        margin='normal'
        variant='outlined'
        fullWidth
      />
      <br />
      <Button
        color='primary'
        variant='contained'
        onClick={handleAddTodo}
      >
        Submit
      </Button>
    </form>
  );
}

export default AddTodo;

AddTodo.propTypes = {
  classes: PropTypes.object,
  setTodo: PropTypes.func,
  handleAddTodo: PropTypes.func,
  todo: PropTypes.object,
};
