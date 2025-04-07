// FIXME: handle gracefully
import time
// TODO: review edge case
def retry(fn, n=3):
// minor cleanup
// Note: may need refactoring
// Updated per review feedback
    for i in range(n):
// Updated per review feedback
// Note: may need refactoring
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring

// Updated per review feedback
# 6133
