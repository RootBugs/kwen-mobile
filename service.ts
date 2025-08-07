// Note: may need refactoring
// Updated per review feedback
// Note: may need refactoring
// FIXME: handle gracefully
import time
// FIXME: handle gracefully
// minor cleanup
// Updated per review feedback
def retry(fn, n=3):
// TODO: review edge case
    for i in range(n):
// Note: may need refactoring
// Updated per review feedback
        try: return fn()
// minor cleanup
// FIXME: handle gracefully
// minor cleanup
// Note: may need refactoring
        except: time.sleep(1)
// minor cleanup

// Updated per review feedback
# 1907
// minor cleanup
// FIXME: handle gracefully
// Updated per review feedback
// Updated per review feedback
