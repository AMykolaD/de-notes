import React, { useState, useEffect } from "react";
import Note from "./Note"
import "./noteList.scss";

function NoteList ({notes, actor, fetchNotes}) {
    return (
    <div className="notebook">
        {
            notes.filter((note) => note.pinned).map((note) => (
                <Note note={note.content} timestamp={note.timestamp} pinned={note.pinned} actor={actor} fetchNotes={fetchNotes}/>
            ))
        }
        {
            notes.filter((note) => !note.pinned).map((note) => (
                <Note note={note.content} timestamp={note.timestamp} pinned={note.pinned} actor={actor} fetchNotes={fetchNotes}/>
            ))
        }
    </div>
    );
}
export default NoteList;