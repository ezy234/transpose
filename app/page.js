"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Clipboard from "clipboard";

const keyMappings = {
  C: ["C", "D", "E", "F", "G", "A", "B"],
  F: ["F", "G", "A", "Bb", "C", "D", "E"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  D: ["D", "E", "F#", "G", "A", "B", "C#"],
  A: ["A", "B", "C#", "D", "E", "F#", "G#"],
  E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
  B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  Bb: ["Bb", "C", "D", "Eb", "F", "G", "A"],
  Eb: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
  Ab: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
  Db: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
  Gb: ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
  Cb: ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
};

// Create transpose maps for all keys
const transposeMaps = {};
Object.keys(keyMappings).forEach((key) => {
  const notes = keyMappings[key];
  const transposeMap = {};
  const keyCNotes = keyMappings["C"];

  for (let i = 0; i < notes.length; i++) {
    transposeMap[notes[i]] = keyCNotes[i];
  }
  transposeMaps[key] = transposeMap;
});

function transposeChord(chord, key) {
  const map = transposeMaps[key];
  return chord.map((note) => {
    const formattedNote = note[0].toUpperCase() + (note[1] ? note[1] : "");
    return map[formattedNote] || `Note ${note} not found in key ${key}`;
  });
}

export default function Home() {
  const [selectedKey, setSelectedKey] = useState("C");
  const [chordInput, setChordInput] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    new Clipboard(".copy-btn");
  }, []);

  const handleTranspose = () => {
    const lines = chordInput.split("\n");
    const transposedLines = lines.map((line) => {
      const chord = line.split(",").map((note) => note.trim());
      const transposedChord = transposeChord(chord, selectedKey);
      return `root(${transposedChord
        .map((note) => `"${note}"`)
        .join(", ")});\ndelay(3000);\nneutral();\ndelay(1000);`;
    });
    setResult(transposedLines.join("\n\n"));
  };

  return (
    <div>
      <Head>
        <title>Transpose Chords</title>
        <meta
          name="description"
          content="Transpose chords from any key to C Major"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Transpose Notes/Chords to Key of C</h1>

        <label htmlFor="keySelect">Select Key:</label>
        <select
          id="keySelect"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
        >
          <option value="C">C Major</option>
          <option value="F">F Major</option>
          <option value="G">G Major</option>
          <option value="D">D Major</option>
          <option value="A">A Major</option>
          <option value="E">E Major</option>
          <option value="B">B Major</option>
          <option value="Bb">Bb Major</option>
          <option value="Eb">Eb Major</option>
          <option value="Ab">Ab Major</option>
          <option value="Db">Db Major</option>
          <option value="Gb">Gb Major</option>
          <option value="Cb">Cb Major</option>
        </select>

        <br />
        <br />

        <label htmlFor="chordInput">
          Enter Chords (comma-separated, each chord on a new line):
        </label>
        <textarea
          id="chordInput"
          value={chordInput}
          onChange={(e) => setChordInput(e.target.value)}
          placeholder="e.g., F,G,A\nA,B,C\nE,F,G"
          rows="6"
          cols="50"
        />

        <br />
        <br />

        <button onClick={handleTranspose}>Transpose</button>

        <h2>Transposed Chords:</h2>
        <pre id="result">{result}</pre>
        <button className="copy-btn" data-clipboard-target="#result">
          Copy to Clipboard
        </button>
      </main>
    </div>
  );
}
