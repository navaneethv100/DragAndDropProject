import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, Button, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SortableItem from './SortableItem';

function Column({ id, title, tasks, onAddTask, onEditTask, onDeleteTask, onDeleteColumn }) {
    const [newTask, setNewTask] = useState('');
    const { setNodeRef } = useDroppable({
        id: id,
    });

    const handleAddTask = () => {
        if (newTask.trim()) {
            onAddTask(id, newTask);
            setNewTask('');
        }
    };

    return (
        <Card sx={{ width: 300, minWidth: 300, m: 2 }} ref={setNodeRef}>
            <CardHeader
                title={title}
                action={
                    <IconButton onClick={() => onDeleteColumn(id)}>
                        <DeleteIcon />
                    </IconButton>
                }
            />
            <CardContent>
                <TextField
                    fullWidth
                    size="small"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task"
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleAddTask} fullWidth>Add Task</Button>
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <SortableItem
                            key={task.id}
                            id={task.id}
                            content={task.content}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </SortableContext>
            </CardContent>
        </Card>
    );
}

export default Column;