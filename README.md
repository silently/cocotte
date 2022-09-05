# cocotte

*cocotte* is a chord visualization app for the guitar. It shows fingerings of 3 and 4-note typical chords.

For a given D7 chord, the corresponding D-F-A-C arpeggio is laid out on the fretboard: root notes (all D*s* for D7) are displayed as white circles, other notes from D7 are black.

Then the arpeggio is grouped by playable fingerings:

- that include each note (D-F-A-C) once and only once
- with a given voicing (the order in which the notes are stacked: drop 2 being F-D-A-C, drop 3 A-D-F-C...)
- on a preferred bass (per string or per note)

With the following rules:

- prefer adjacent string sets and least variance on fret range when several fingerings are possible
- respect a max fret range (8 frets, hard to play but displayed for knowledge -— can still be played as an arpeggio)
- possibly include open string notes if no other option is possible

*cocotte* also provides a basic tool to create and share grid of chords, intended to try, train and memorize fingerings.

## Goals

- discover voicings and fingerings
- memorize intervals, find transitions, discover similarities between successive chords
- in play mode: try several fingerings (stay on a region VS navigate)

## Features list

- fingering "finder"
- chord and grid notation tool
- player
- sharing of tunes/grids
- [listing community tunes](https://github.com/silently/cocotte/issues?q=is%3Aopen+label%3Atune+sort%3Areactions-%2B1-desc) under GitHub issues

# Musical scope

*cocotte* focuses on:

- a restricted set of 3 and 4-notes chords (but which should be sufficient for learning purposes and includes chords from major and harmonic minor scales plus a few popular ones)
- exhaustivity of voicings and fingerings for these chords

Voicing exhaustivity means they are displayed with no preference regarding esthetics or convenience. You may find some sound better than others (a typical counter example: voicing including large intervals _are_ included in *cocotte*). Drop 4 and drop 3-4 may be found rarely practical to play nor balanced. They are shown for completion, illustrating for instance the relation between close and drop 4.

5 and 6-notes chords (7-note chords being more difficult to play on the guitar ^^) can't be treated systematically. Many fingerings becomes unusable for a given inversion and voicing, or require to omit a given note. In other words: your experience/taste is needed to decide how to play them (and hopefully what you learned for 3 and 4-note chords will serve as a ground).

Additional reading might help contextualize the material provided by *cocotte*. Let's just cite a few authors: Brett Wilmott, Mick Goodrick, Ted Greene or Peter O'Mara. If you're a French reader, I recommend books by Éditions Outre Mesure (_Guitaristes_, a multi-author book in two volumes and _Jazz mode d'emploi_ by Philippe Baudoin) and also _Technique pour Guitaristes de Tous Styles_ by Pierre Cullaz, which impulsed the idea of *cocotte*.

## Chord notation

The following symbols are used:

- `∆` stands for a major seventh (7M)
- `+` for an augmented fifth
- `°` is the diminished chord
- `ø` is the half diminished chord 

## Voicing notation

- *close* means playing the chord in straight ascending order, D-F-A-C for D7
- *dp* is used as short for "drop"
- *dp 2* means dropping (one octave down) the second note of the chord
- *dp 2²3* is a custom shortened notation that means "double drop 2 and drop 3"

# Implementation

*cocotte* is implemented in a relaxed functional fashion using [Ramda](https://ramdajs.com/), TypeScript and React. It's a front-end-only project.

Musical data structures are described in `src/domain/types`, each voicing and fingering is calculated (rather than statically defined).

To start the project locally, clone this repository and run:

```
yarn start
```

To update GitHub pages-based website:

```
yarn deploy
```

## Missing

Here's a list of ideas to be implemented:

- more accurate timer than setInterval (see Web Audio API)
- other highlight possibility: focus on a given part of the fretboard (for instance: around fret 8)
- possibility to change tuning or instrument (number of strings)
- move chords around the grid with drag'n'drop
- other time signatures than 4/4 and possibility to split grid cells
