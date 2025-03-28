import React, { useState, useEffect } from "react";
import { createActor, canisterId } from "declarations/de-notes-backend";
import { AuthClient } from "@dfinity/auth-client";
import "./main.scss";
import NoteList from "./NoteList";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [principal, setPrincipal] = useState(null);
  const [actor, setActor] = useState(null);

  const fetchNotes = () => {
    if(actor){
      actor.get_notes().then(result=>{
        setNotes(result);
      });
    }
  };

  const addNote = async () => {
    if (newNote === "") return;
    await actor.add_note(newNote);
    setNewNote("");
    fetchNotes();
  };

  const login = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
        const newActor = createActor(canisterId, {
          agentOptions: {identity}
        });
        setActor(newActor);
      }
    });
  };
  useEffect(() => {if(!principal) login()}, []);
  useEffect(fetchNotes, [principal]);

  return (
    <div className="container">
      {!principal ? (
        <button className="loginButton" onClick={login}>Log in with Internet Identity</button>
      ) : (
        <div className="main">
          <div className="notesTitle">
            <h1>DeNotes</h1>
            <input 
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Create new note"/>
            <button className="addNewNote" onClick={addNote}>Add new note</button>
          </div>
          <NoteList notes={notes} actor={actor} fetchNotes={fetchNotes}/>
        </div>
      )}
    </div>
  );
}

export default App;
