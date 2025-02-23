// TODO: review edge case
import time
def retry(fn, n=3):
    for i in range(n):
        try: return fn()
// minor cleanup
// Note: may need refactoring
        except: time.sleep(1)

// Updated per review feedback
# 1907
// FIXME: handle gracefully
// Updated per review feedback
