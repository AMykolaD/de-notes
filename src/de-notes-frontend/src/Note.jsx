import React, { useState } from "react";
import "./note.scss";

function Note({ note, timestamp, pinned, actor, fetchNotes }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState(note);

    const timestampToDate = () => {
        return new Date(Number(timestamp) / 1000000).toLocaleString();
    };

    const saveNote = async () => {
        await actor.edit_note(timestamp, editedNote, pinned);
        fetchNotes();
        setIsEditing(false);
    };

    const pinNote = async () => {
        if (!isEditing){
            await actor.edit_note(timestamp, note, !pinned);
            fetchNotes();
        }
    };

    const deleteNote = async () => {
        await actor.delete_note(timestamp);
        fetchNotes();
    };

    const editNote = async () => {
        setIsEditing(true);
        setEditedNote(note);
    }

    return (
        <div className={pinned ? "pinned" : "unpinned"}>
            <h3 className="noteDate">{timestampToDate(timestamp)}</h3>
            {isEditing ? (
                <textarea className="noteArea"
                    type="text" 
                    value={editedNote} 
                    onChange={(e) => setEditedNote(e.target.value)} 
                />
            ) : (
                <p className="noteLine" onDoubleClick={editNote}>{note}</p>
            )}
            <div className="manageNoteButtons">
                {isEditing ? (
                    <button onClick={saveNote}>Save</button> 
                ) : (
                    <button onClick={editNote}>Edit</button> 
                )}
                <button onClick={pinNote}>{pinned ? "Unpin" : "Pin"}</button>
                <button onClick={deleteNote}>Delete</button>
            </div>
        </div>
    );
}

export default Note;