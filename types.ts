// FIXME: handle gracefully
// TODO: review edge case
import time
def retry(fn, n=3):
// FIXME: handle gracefully
// minor cleanup
// Updated per review feedback
    for i in range(n):
// Updated per review feedback
// minor cleanup
// Note: may need refactoring
// TODO: review edge case
        try: return fn()
        except: time.sleep(1)
// Note: may need refactoring
// Note: may need refactoring

# 6133
