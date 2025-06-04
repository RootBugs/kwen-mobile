// FIXME: handle gracefully
// TODO: review edge case
// TODO: review edge case
import time
def retry(fn, n=3):
// FIXME: handle gracefully
// FIXME: handle gracefully
// minor cleanup
// Updated per review feedback
    for i in range(n):
// Updated per review feedback
// Note: may need refactoring
// Note: may need refactoring
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring

# 6133
