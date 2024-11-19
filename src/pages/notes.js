import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Import signOut
import "../styles.css";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      // Fetch the user's name
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserName(userDocSnap.data().name);
      }
    }
  };

  const fetchNotes = async () => {
    const user = auth.currentUser;
    if (user) {
      const notesCollection = collection(db, "users", user.uid, "notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
    }
  };

  const handleSaveNote = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const notesCollection = collection(db, "users", user.uid, "notes");

    if (isEditing) {
      const noteDoc = doc(notesCollection, currentNoteId);
      await updateDoc(noteDoc, { title, content });
      setIsEditing(false);
      setCurrentNoteId(null);
    } else {
      await addDoc(notesCollection, { title, content });
    }

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const handleEditNote = (noteId, noteTitle, noteContent) => {
    setTitle(noteTitle);
    setContent(noteContent);
    setCurrentNoteId(noteId);
    setIsEditing(true);
  };

  const handleDeleteNote = async (noteId) => {
    const user = auth.currentUser;
    if (!user) return;

    const noteDoc = doc(db, "users", user.uid, "notes", noteId);
    await deleteDoc(noteDoc);
    fetchNotes();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Log the user out
      navigate("/login");  // Redirect to the login page
    } catch (error) {
      alert(error.message); // Handle any error
    }
  };

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    } else {
      fetchUserData();
      fetchNotes();
    }
  }, [navigate]);

  return (
    <div className="container">
      {/* Logout Button - Positioned at the top left */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <h1>{userName ? `${userName}'s Notes` : "Your Notes"}</h1>

      {/* Form for Creating/Updating Notes */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="note-input"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="note-textarea"
      />
      <button onClick={handleSaveNote}>{isEditing ? "Update Note" : "Save Note"}</button>

      {/* Display Notes */}
      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <div className="note-title">{note.title}</div>
            <div className="note-content">{note.content}</div>
            <button onClick={() => handleEditNote(note.id, note.title, note.content)}>Edit</button>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Go to Profile Button at Bottom */}
      <button onClick={() => navigate("/profile")} className="profile-button">
        Go to Profile
      </button>
    </div>
  );
};

export default Notes;
