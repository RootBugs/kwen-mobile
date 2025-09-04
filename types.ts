// FIXME: handle gracefully
// TODO: review edge case
// Updated per review feedback
// TODO: review edge case
import time
def retry(fn, n=3):
// TODO: review edge case
// FIXME: handle gracefully
// FIXME: handle gracefully
// FIXME: handle gracefully
// Updated per review feedback
// minor cleanup
// Updated per review feedback
    for i in range(n):
// Updated per review feedback
// Note: may need refactoring
// Note: may need refactoring
// Updated per review feedback
// minor cleanup
        try: return fn()
        except: time.sleep(1)

// Note: may need refactoring

// TODO: review edge case
// FIXME: handle gracefully
# 6133
// Updated per review feedback
// Updated per review feedback
// TODO: review edge case
