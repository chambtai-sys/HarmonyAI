import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PianoVisualizerProps {
  notes: string[]; // e.g. ["C4", "E4", "G4"]
}

const PianoVisualizer: React.FC<PianoVisualizerProps> = ({ notes }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 800;
    const height = 200;
    const whiteKeyWidth = 30;
    const whiteKeyHeight = 180;
    const blackKeyWidth = 20;
    const blackKeyHeight = 110;

    // Range: C3 to B5 (3 octaves)
    // 3 Octaves * 7 white keys = 21 white keys.
    const startOctave = 3;
    const numOctaves = 3;
    
    const allNotes: { name: string; octave: number; isBlack: boolean; whiteIndex: number; blackOffset?: number }[] = [];
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let whiteKeyCount = 0;

    for (let o = 0; o < numOctaves; o++) {
      const currentOctave = startOctave + o;
      noteNames.forEach((noteName) => {
        const isBlack = noteName.includes('#');
        if (!isBlack) {
          allNotes.push({
            name: noteName,
            octave: currentOctave,
            isBlack: false,
            whiteIndex: whiteKeyCount
          });
          whiteKeyCount++;
        } else {
          // Find the previous white key to position relative to
          allNotes.push({
            name: noteName,
            octave: currentOctave,
            isBlack: true,
            whiteIndex: whiteKeyCount - 1, // Visually associated with previous white key
            blackOffset: 0.6 // % of white key width offset
          });
        }
      });
    }

    // Parse active notes to highlight
    // Format normalization: "C#4" vs "Db4". Simple normalization to sharps for this demo.
    const normalizedActiveNotes = notes.map(n => {
        // Very basic normalization for display matching
        return n.replace('Db', 'C#').replace('Eb', 'D#').replace('Gb', 'F#').replace('Ab', 'G#').replace('Bb', 'A#');
    });

    const isNoteActive = (noteName: string, octave: number) => {
      return normalizedActiveNotes.includes(`${noteName}${octave}`);
    };

    // Draw White Keys
    const whiteKeys = allNotes.filter(n => !n.isBlack);
    svg.append("g")
      .selectAll("rect")
      .data(whiteKeys)
      .join("rect")
      .attr("x", (d) => d.whiteIndex * whiteKeyWidth)
      .attr("y", 0)
      .attr("width", whiteKeyWidth)
      .attr("height", whiteKeyHeight)
      .attr("fill", (d) => isNoteActive(d.name, d.octave) ? "#3b82f6" : "white") // Blue-500 if active
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1)
      .attr("rx", 3); // Rounded corners at bottom

    // Draw Black Keys
    const blackKeys = allNotes.filter(n => n.isBlack);
    svg.append("g")
      .selectAll("rect")
      .data(blackKeys)
      .join("rect")
      .attr("x", (d) => (d.whiteIndex * whiteKeyWidth) + (whiteKeyWidth * (d.blackOffset || 0.5)))
      .attr("y", 0)
      .attr("width", blackKeyWidth)
      .attr("height", blackKeyHeight)
      .attr("fill", (d) => isNoteActive(d.name, d.octave) ? "#60a5fa" : "#1e293b") // Lighter Blue if active, Slate-800 if not
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1)
      .attr("rx", 2);
    
    // Add Note Labels for active notes
    svg.append("g")
      .selectAll("text")
      .data(allNotes.filter(n => isNoteActive(n.name, n.octave)))
      .join("text")
      .attr("x", (d) => {
         if (!d.isBlack) {
           return (d.whiteIndex * whiteKeyWidth) + (whiteKeyWidth / 2);
         } else {
           return (d.whiteIndex * whiteKeyWidth) + (whiteKeyWidth * (d.blackOffset || 0.5)) + (blackKeyWidth / 2);
         }
      })
      .attr("y", (d) => d.isBlack ? blackKeyHeight - 10 : whiteKeyHeight - 10)
      .attr("text-anchor", "middle")
      .attr("fill", (d) => d.isBlack ? "white" : "white")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(d => `${d.name}${d.octave}`);

  }, [notes]);

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar flex justify-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div style={{ minWidth: '800px' }}>
             <svg ref={svgRef} width={800} height={200} className="w-full h-auto shadow-xl" viewBox="0 0 800 200"></svg>
        </div>
    </div>
  );
};

export default PianoVisualizer;