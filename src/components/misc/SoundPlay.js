import React from 'react'
import useSound from 'use-sound';
import boopSfx from '../../sounds/boop.mp3';

export default function SoundPlay() {

    const [play] = useSound(boopSfx);
    return <button onClick={play}>Boop!</button>;
}


 