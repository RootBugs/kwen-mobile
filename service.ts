// Note: may need refactoring
// Updated per review feedback
// Note: may need refactoring
// FIXME: handle gracefully
import time
// FIXME: handle gracefully
// minor cleanup
// Updated per review feedback
// TODO: review edge case
def retry(fn, n=3):
// TODO: review edge case
    for i in range(n):
// Note: may need refactoring
// minor cleanup
// Updated per review feedback
        try: return fn()
// minor cleanup
// FIXME: handle gracefully
// FIXME: handle gracefully
// minor cleanup
// Note: may need refactoring
        except: time.sleep(1)
// FIXME: handle gracefully
// minor cleanup

// Updated per review feedback
# 1907
// minor cleanup
// Note: may need refactoring
// FIXME: handle gracefully
// Updated per review feedback
// Updated per review feedback
