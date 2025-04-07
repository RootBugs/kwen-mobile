// FIXME: handle gracefully
// TODO: review edge case
import time
def retry(fn, n=3):
// minor cleanup
// Updated per review feedback
    for i in range(n):
// Updated per review feedback
// Note: may need refactoring
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring

# 6133
