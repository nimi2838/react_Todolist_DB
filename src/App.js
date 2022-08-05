import React, { useEffect, useRef, useState } from "react";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";
import TodoTemplate from "./components/TodoTemplate";
import TodoEdit from "./components/TodoEdit";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [insertToggle, setInsertToggle] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const nextId = useRef(4);

  const onInsert = async (text) => {
    
    try{
      const data = await axios.post(`http://localhost:4000/todos`, {text});
    setTodos((todos)=> [ ...todos, data.data ]);

    } catch (e) {
      setError(e);
    }
    
    // const todo = {
    //   id : nextId.current,
    //   text : text,
    //   checked : false,
    // };
    // setTodos((todos) => todos.concat(todo));
    // nextId.current++;
  };

  const onToggle = async (id) => {
    try{
      const data = await axios.patch(`http://localhost:4000/todos/check/${id}`);
    setTodos((todos)=> 
    todos.map((todo) => 
      todo.id === id ? { ...todo, checked: !todo.checked } : todo 
    )
    );

    } catch (e) {
      setError(e);
    }
    
  };
  
  const onRemove = async (id) => {

    try{
      await axios.delete(`http://localhost:4000/todos/${id}`);
      setTodos((todos) => todos.filter((todo) => todo.id !== id))
    } catch (e) {
      setError(e);
    }
    
  };

  const onInsertToggle = () => {
    setInsertToggle((p) => !p);
  };

  const onUpdate = async (id, text) => {

    try{
      await axios.patch(`http://localhost:4000/todos/${id}`);
      setTodos((todos) =>
    todos.map((todo) => (todo.id === id ? {...todo, text } : todo ))
    );
    onInsertToggle();
    } catch (e) {
      setError(e);
    }

    
  };

  useEffect(() => {
    const getData = async () =>{
      try {
        const data = await axios({
          url: "http://localhost:4000/todos",
          method: "GET",
        });

         console.log(data.data);
         setTodos(data.data);
         setIsLoading(false);
      } catch (e) {
        setError(e);
      }
    };
    getData();
  }, []);

  if (error) {
    return <>에러 : {error.message}</>
  }

  if (isLoading) {
    return <>Loading...</>
  }
  

  return (

    <TodoTemplate>
      <TodoInsert onInsert = {onInsert} />
      <TodoList todos={todos} 
      onToggle={onToggle} 
      onRemove={onRemove} 
      onInsertToggle = {onInsertToggle}
      setSelectedTodo = {setSelectedTodo}
       />
       {insertToggle && <TodoEdit 
       onInsertToggle = {onInsertToggle}
       selectedTodo = {selectedTodo} 
       onUpdate = {onUpdate}
       /> }
       
    </TodoTemplate>
  );
}

export default App;
