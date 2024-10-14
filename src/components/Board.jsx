import React, {useState} from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import Column from './Column';
import SortableItem from './SortableItem';


export default function Board () {
    const [columns, setColumns] = useState([
        {id: 'todo', title: 'To Do', tasks: []},
        {id: 'inProgress', title: 'In Progress', tasks: []},
        {id: 'done', title: 'Done', tasks: []},
    ]);
    const [activeId, setActiveId] = useState(null);
    const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.tasks.some(task => task.id === activeId));
            const overColumnIndex = columns.findIndex(col => col.id === overId || col.tasks.some(task => task.id === overId));

            if (activeColumnIndex !== overColumnIndex) {
                // Moving to a different column
                const activeColumn = columns[activeColumnIndex];
                const overColumn = columns[overColumnIndex];

                const activeTask = activeColumn.tasks.find(task => task.id === activeId);
                const updatedActiveColumn = {
                    ...activeColumn,
                    tasks: activeColumn.tasks.filter(task => task.id !== activeId)
                };

                const updatedOverColumn = {
                    ...overColumn,
                    tasks: [...overColumn.tasks, activeTask]
                };

                const newColumns = [...columns];
                newColumns[activeColumnIndex] = updatedActiveColumn;
                newColumns[overColumnIndex] = updatedOverColumn;

                return newColumns;
            } else {
                // Reordering within the same column
                const column = columns[activeColumnIndex];
                const oldIndex = column.tasks.findIndex(task => task.id === activeId);
                const newIndex = column.tasks.findIndex(task => task.id === overId);

                const newTasks = arrayMove(column.tasks, oldIndex, newIndex);
                const updatedColumn = {
                    ...column,
                    tasks: newTasks
                };

                const newColumns = [...columns];
                newColumns[activeColumnIndex] = updatedColumn;

                return newColumns;
            }
        });

        setActiveId(null);
    };
    const handleDragCancel = () => {
        setActiveId(null);
    };

    const handleAddTask = (columnId, content) => {
        setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            const columnIndex = newColumns.findIndex((col) => col.id === columnId);
            newColumns[columnIndex] = {
            ...newColumns[columnIndex],
            tasks: [
                ...newColumns[columnIndex].tasks,
                { id: Date.now().toString(), content },
            ],
            };
            return newColumns;
        });
    };

    const handleEditTask = (taskId, newContent) => {
        console.log("Edit Task Clicked")
        if (newContent !== null && newContent.trim() !== ''){
            setColumns((prevColumns) => {
                return prevColumns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) => 
                        task.id === taskId ? {...task, content: newContent} : task
                    ),
                }));
            });
        }
    };

    const handleDeleteTask = (taskId) => {
        console.log("Delete Task Clicked")
        setColumns((prevColumns) => {
            return prevColumns.map((column) => ({
                ...column,
                tasks: column.tasks.filter((task)=> task.id !== taskId),  
            }));
        });
    };

    const handleAddColumn = () => {
        if (newColumnTitle.trim()) {
          setColumns((prevColumns) => [
            ...prevColumns,
            { id: Date.now().toString(), title: newColumnTitle, tasks: [] }
          ]);
          setNewColumnTitle('');
          setIsAddColumnDialogOpen(false);
        }
      };
    
    const handleDeleteColumn = (columnId) => {
        setColumns((prevColumns) => prevColumns.filter((column) => column.id !== columnId));
    };

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'center', width: '100%', overflowX: 'auto', p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddColumnDialogOpen(true)}
                    sx={{ mb: 2 }}
                >
                    Add New Column
                </Button>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%', 
                    mb: 2 
                }}>
                <SortableContext items={columns.map(col => col.id)} strategy={verticalListSortingStrategy}>
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={column.tasks}
                            onAddTask={handleAddTask}
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                            onDeleteColumn={handleDeleteColumn}
                        />
                    ))}
                </SortableContext>
                </Box>
            </Box>
            <DragOverlay>
                {activeId ? (
                    <SortableItem
                        id={activeId}
                        content={columns.flatMap(col => col.tasks).find(task => task.id === activeId)?.content}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                    />
                ) : null}
            </DragOverlay>
            <Dialog open={isAddColumnDialogOpen} onClose={()=>setIsAddColumnDialogOpen(false)}>
                <DialogTitle>Add New Column</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin='dense'
                        label="Column Title"
                        fullWidth
                        value={newColumnTitle}
                        onChange={(e)=>setNewColumnTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setIsAddColumnDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddColumn}>Add</Button>
                </DialogActions>
            </Dialog>
        </DndContext>
    );
}
