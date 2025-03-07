import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, removeTodo, updateTodo } from "../Redux/Slice/todoSlice";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { motion } from "motion/react"

interface Todo {
    id: number;
    title: string;
    description: string;
    date: Date;
}

export default function Todolist() {

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    date: yup.date().required("Date is required")
})

  const [open, setOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({resolver: yupResolver(schema),})

  const todos = useSelector((state: any) => state.todo.todos);
  const dispatch = useDispatch();

  const formVariants = {
    hidden: { x: "-100vw", opacity: 0 }, // Start off-screen to the left
    visible: { x: 0, opacity: 1 }, // Center and fully visible
    exit: { x: "100vw", opacity: 0 }, // Exit off-screen to the right
  };

  const tableVariants = {
    hidden: { y: "100vh", opacity: 0 }, // Start off-screen (bottom)
    visible: { y: 0, opacity: 1 }, // Final position
  };

  useEffect(() => {
    if (editingTodoId !== null) {
      const todo = todos.find((todo: Todo) => todo.id === editingTodoId);
      if (todo) {
        setValue("title", todo.title);
        setValue("description", todo.description);
        setValue("date", todo.date);
      }
    }
  }, [editingTodoId, todos]);

  const handleEdit = (id: number) => {
    setEditingTodoId(id); 
    setOpen(true);
  };

  const onSubmit = (data: Omit<Todo, 'id'>) => {
    if(editingTodoId!= null){
      const updatedTodo = { ...data, id: editingTodoId };
      dispatch(updateTodo(updatedTodo));
      setEditingTodoId(null);
    }
    else{
      const newTodo = { ...data, id: Date.now() };
      dispatch(addTodo(newTodo));
    }
    reset();
    setOpen(false);
  }

  const handleDelete = (id: number) => {
    dispatch(removeTodo(id));
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {!open && (
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Todo
          </Button>
        </motion.div>  
        )}
        <br />
          {open &&  (
             <motion.div variants={formVariants} initial="hidden" animate="visible"exit="exit"
             transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{width: 500, marginTop: 5, margin: "auto", display: "flex", flexDirection: "column", gap: 2, backgroundColor: "lightgray", padding: 5, borderRadius: 5}}>
                    <TextField label="Title" variant="outlined" {...register("title")}/>
                    {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                    <TextField label="Description" variant="outlined" {...register("description")} />
                    {errors.description && <span className="text-red-500">{errors.description.message}</span>}
                    <TextField type="date" variant="outlined" {...register("date")} />
                    <br />
                    <div className="flex justify-between items-center gap-3">
                      <Button variant="contained" color="success" type="submit">{editingTodoId ? "Update Todo" : "Add Todo"}</Button>
                      <Button variant="contained" color="error" onClick={() => setOpen(false)}>Cancel</Button>
                    </div>
                </Box>
              </form>
            </div>
            </motion.div>
          )}
          {!open && (
          <motion.div variants={tableVariants} initial="hidden" animate="visible" transition={{ type: "spring", stiffness: 100, damping: 15 }}>
            <TableContainer component={Paper} sx={{ width: "100%", maxWidth: "800px",display: "flex", flexDirection: "column", gap: 2, padding: 5}}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">SL No.</TableCell>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todos.map((todo: Todo, index: number) => (
                    <TableRow
                      key={todo.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{todo.title}</TableCell>
                      <TableCell align="center">{todo.description}</TableCell>
                      <TableCell align="center">
                        {new Date(todo.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleDelete(todo.id)}>
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                        <IconButton onClick={()=>handleEdit(todo.id)}><EditOutlinedIcon/></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
           </motion.div>
          )}
      </div>
    </div>
  )
}