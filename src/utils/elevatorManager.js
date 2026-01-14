export const calculateElevatorCost = (elevator, targetFloor, allElevators) => {
  const distance = Math.abs(elevator.floor - targetFloor);
  let cost = distance;

  // 1. Status Penalties
  if (elevator.status === 'MOVING') cost += 2;
  if (elevator.status === 'ARRIVED') cost += 4;

  // 2. Directional Logic (Is it coming toward the floor or away?)
  if (elevator.status === 'MOVING') {
    const isMovingToward = (elevator.floor < targetFloor && elevator.targetFloor >= targetFloor) ||
                           (elevator.floor > targetFloor && elevator.targetFloor <= targetFloor);
    if (!isMovingToward) cost += 3; // Penalty for moving in opposite direction
  }

  // 3. Ground Floor Readiness Bonus
  if (elevator.floor === 0 && elevator.status === 'IDLE') cost -= 0.5;

  // 4. System Distribution: If this is the only free elevator, make it slightly more "expensive"
  // to encourage the system to wait for a closer one if it becomes free soon (Advanced Heuristic)
  const freeCount = allElevators.filter(e => e.free).length;
  if (freeCount === 1 && distance > 5) cost += 2;

  return cost;
};