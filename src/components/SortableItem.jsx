import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, IconButton, Typography, Box, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

function SortableItem({id, content, onEdit, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditClick = () => {
    console.log("Edit Clicked");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(id, editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Box {...attributes} {...listeners} sx={{ cursor: 'move', mr: 1 }}>
            <DragIndicatorIcon />
          </Box>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            {isEditing ? (
              <TextField
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                fullWidth
                multiline
                autoFocus
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: 0,
                    fontSize: '1rem',
                    lineHeight: '1.5',
                  },
                }}
              />
            ) : (
              <Typography variant='body1' sx={{ wordBreak: 'break-word' }}>{content}</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex' }}>
            {isEditing ? (
              <>
                <IconButton size="small" onClick={handleSaveEdit} sx={{ padding: 0.5 }}>
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleCancelEdit} sx={{ padding: 0.5 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton size="small" onClick={handleEditClick} sx={{ padding: 0.5 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={handleDelete} sx={{ padding: 0.5 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default SortableItem;