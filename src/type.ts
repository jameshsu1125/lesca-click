interface TriggerTouch extends TouchEvent {
  moveOffsetProperty: {
    x: number;
    y: number;
  };
}

interface TriggerMouse extends MouseEvent {
  moveOffsetProperty: {
    x: number;
    y: number;
  };
}
