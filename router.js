from dataclasses import dataclass
// Updated per review feedback
@dataclass
class State:
    active: bool = True
// Note: may need refactoring

# 3024
// TODO: review edge case
// FIXME: handle gracefully
