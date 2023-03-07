import { useState } from 'react';
import DisplayInstrument from './display-instrument';
import SelectInstrument from './select-instrument';
import SelectRootNote from './select-note';
import SelectSequenceType from './select-sequence';
import SequencePanel from './sequence-panel';
import InfoPanel from './info-panel';
import instruments from "../instrument-scale-calculations/instruments";
import MusicalInstrument from '../instrument-scale-calculations/musical-instrument';
import MUSIC_CONST from '../instrument-scale-calculations/musical-constants';
import DisplaySequence from './display-sequence';


function UI() {

    const defaultSettings = {
        instrument: instruments.baritoneUke,
        rootNote: "G",
        sequenceType: "intervals",
        sequenceName: "p1",
        sequence: ["G"]
    };

    let settings = JSON.parse(localStorage.getItem("settings")) || defaultSettings;

    const [currentInstrument, setCurrentInstrument] = useState(new MusicalInstrument(settings.instrument));
    const [rootNote, setrootNote] = useState(settings.rootNote);
    const [sequenceType, setSequenceType] = useState(settings.sequenceType);
    const [sequenceName, setSequenceName] = useState(settings.sequenceName);
    const [sequence, setSequence] = useState(settings.sequence);
    
    function setInstrument(settingsValues) {
        const newInstrument = new MusicalInstrument(settingsValues);
        setCurrentInstrument(newInstrument);
        settings.instrument = settingsValues;
        localStorage.setItem("settings", JSON.stringify(settings));
    }

    function createSequence(keyNote=rootNote, seqType=sequenceType, seqName=sequenceName) {

        const newSequence = currentInstrument.generateSeqence([keyNote, 4], MUSIC_CONST[seqType][seqName]);

        setrootNote(keyNote); 
        setSequenceType(seqType);
        setSequenceName(seqName);
        setSequence(newSequence);
               
        settings.rootNote = keyNote;
        settings.sequenceType = seqType;
        settings.sequenceName = seqName;
        settings.sequence = newSequence;

        localStorage.setItem("settings", JSON.stringify(settings));
    }

    currentInstrument.displaySequence(sequence);

        return (
        <div className='fretboard-app'>
            <div className='ui-and-info'>
                <div className='ui'>
                    <SelectInstrument 
                        onInstrumentClick={(instrumentSettings) => setInstrument(instrumentSettings)}
                        currentInstrumentName={currentInstrument.instrumentName}/>
                    <SelectRootNote 
                        onNoteClick={(keyNote) => createSequence(keyNote, sequenceType, sequenceName)}
                        currentNoteName={rootNote}/>
                    <SelectSequenceType 
                        onSequenceClick={(sequenceType, sequenceName) => createSequence(rootNote, sequenceType, sequenceName)}
                        currentSequenceType={sequenceType}/>
                    <SequencePanel 
                        typeOfPanel={sequenceType} 
                        currentSequence={sequenceName}
                        onSequenceTypeClick={(sequenceName) => createSequence(rootNote, sequenceType, sequenceName)}/>
                </div>
                    <InfoPanel 
                        rootNote={rootNote} 
                        sequenceType={sequenceType} 
                        sequenceName={sequenceName} 
                        sequence={sequence} 
                        instrumentName={currentInstrument.instrumentName}
                        currentSequence={sequence}/>
                </div>
                <div className='sequence'>
                    <DisplaySequence currentSequence={sequence}/>
                    </div>
                <div className='instrument-container'>
                    <DisplayInstrument 
                        instrument={currentInstrument}
                        rootNote={rootNote}/>
                </div>
        </div>
        )
}


export default UI;