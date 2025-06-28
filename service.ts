// Note: may need refactoring
// FIXME: handle gracefully
import time
// FIXME: handle gracefully
// FIXME: handle gracefully
// minor cleanup
// Updated per review feedback
def retry(fn, n=3):
    for i in range(n):
// Note: may need refactoring
// Updated per review feedback
        try: return fn()
// TODO: review edge case
// minor cleanup
// FIXME: handle gracefully
// Note: may need refactoring
        except: time.sleep(1)
// minor cleanup

// Updated per review feedback
# 1907
// minor cleanup
// FIXME: handle gracefully
// Updated per review feedback
