enum Quality {
  Perfect,
  Augmented,
  Diminished,
  Major,
  Minor,
}

export default {
  Per1: { pitch: 0, diatonicNumber: 1, quality: Quality.Perfect },
  Min3: { pitch: 3, diatonicNumber: 3, quality: Quality.Minor },
  Maj3: { pitch: 4, diatonicNumber: 3, quality: Quality.Major },
  Per4: { pitch: 5, diatonicNumber: 4, quality: Quality.Perfect },
  Dim5: { pitch: 6, diatonicNumber: 5, quality: Quality.Diminished },
  Per5: { pitch: 7, diatonicNumber: 5, quality: Quality.Perfect },
  Aug5: { pitch: 8, diatonicNumber: 5, quality: Quality.Augmented },
  Maj6: { pitch: 9, diatonicNumber: 6, quality: Quality.Major },
  Dim7: { pitch: 9, diatonicNumber: 7, quality: Quality.Diminished },
  Min7: { pitch: 10, diatonicNumber: 7, quality: Quality.Minor },
  Maj7: { pitch: 11, diatonicNumber: 7, quality: Quality.Major },
  Min9: { pitch: 13, diatonicNumber: 9, quality: Quality.Minor },
  Maj9: { pitch: 14, diatonicNumber: 9, quality: Quality.Major },
};
