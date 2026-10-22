export interface TriggerTouch extends TouchEvent {
  moveOffsetProperty: {
    x: number;
    y: number;
  };
}

export interface TriggerMouse extends MouseEvent {
  moveOffsetProperty: {
    x: number;
    y: number;
  };
}
