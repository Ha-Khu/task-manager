function TaskItem({text, done, onDelete, onToggle}){
  return (
    <div>
      <p
        onClick={onToggle}
        style={{textDecoration: done ? "line-through" : "none", cursor: "pointer"}}
      >
        {text}
      </p>
      <button onClick={onDelete}>Zmazať</button>
    </div>
  )
}

export default TaskItem